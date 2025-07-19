import { expenseTypes } from "@/constants";
import { useConfirmationModal, useDevice } from "@/hooks";
import { Avatar, Avatars, Typography } from "@/library";
import { useAuthStore, useWalletStore } from "@/store";
import { ExpenseSpread, ISplit } from "@/types";
import {
	getUserDetails,
	Notify,
	roundOff,
	stylesConfig,
	WalletUtils,
} from "@/utils";
import dayjs from "dayjs";
import React from "react";
import { FiTrash } from "react-icons/fi";
import styles from "./styles.module.scss";
import { Tag } from "./tags";

type ExpenseRowProps = {
	expense: ExpenseSpread;
	expanded: boolean;
	onExpand: () => void;
};

type ExpenseRowSplitProps = {
	expense: ExpenseSpread;
	split: Omit<ISplit, "expense">;
	onUpdate: () => void;
};

const classes = stylesConfig(styles, "expense-row");

const ExpenseRowSplit: React.FC<ExpenseRowSplitProps> = ({
	expense,
	split,
	onUpdate,
}) => {
	const { user: loggedInUser } = useAuthStore();
	const { settleSplitInExpense, isSettling } = useWalletStore();
	const { pending, completed, user } = split;
	const settleMember = async () => {
		await settleSplitInExpense(expense.id, split.id);
		onUpdate();
	};
	return (
		<div
			className={classes("-split", {
				"-split--owed": pending > 0,
				"-split--settling": isSettling,
				"-split--settled":
					pending === 0 || expense.author.id === user.id,
			})}
		>
			<Avatar
				src={getUserDetails(user).avatar || ""}
				alt={getUserDetails(user).name || ""}
				size={36}
			/>
			{(() => {
				if (expense.author.id === user.id) {
					return (
						<Typography size="sm">
							{`${getUserDetails(expense.author).name} paid ${roundOff(completed, 2)} for this expense`}
						</Typography>
					);
				} else {
					if (pending === 0) {
						return (
							<Typography size="sm">
								{`${getUserDetails(user).name} has paid ${roundOff(completed, 2)} to ${expense.author.name || expense.author.email.slice(0, 7) + "..."}`}
							</Typography>
						);
					} else {
						return (
							<Typography size="sm">
								{`${getUserDetails(user).name} owes ${roundOff(pending, 2)} to ${expense.author.name || expense.author.email.slice(0, 7) + "..."}`}
							</Typography>
						);
					}
				}
			})()}
			{expense.author.id === loggedInUser?.id ? (
				<button
					disabled={pending === 0 || isSettling}
					className={classes("-split-btn", {
						"-split-btn--settled": pending === 0,
					})}
					onClick={settleMember}
				>
					{pending === 0 ? (
						"Settled"
					) : isSettling ? (
						<span className={classes("-split-btn--loader")} />
					) : (
						"Settle"
					)}
				</button>
			) : pending === 0 ? (
				<Typography
					size="sm"
					style={{
						color: pending === 0 ? "green" : "red",
					}}
					className={classes("-split-btn", "-split-btn--disabled")}
				>
					Settled
				</Typography>
			) : null}
		</div>
	);
};

export const ExpenseRow: React.FC<ExpenseRowProps> = ({
	expense,
	expanded,
	onExpand,
}) => {
	const { user: loggedInUser } = useAuthStore();
	const { sync, deleteExpense, isDeleting } = useWalletStore();
	const { device } = useDevice();

	const deleteExpenseHelper = async () => {
		try {
			await deleteExpense(expense.id);
		} catch (error) {
			Notify.error(error);
		}
	};

	const deleteExpenseConfirmation = useConfirmationModal(
		`Delete Expense ${expense.title}`,
		<>
			Are you sure you want to delete this expense?
			<br />
			This action cannot be undone
		</>,
		async () => {
			await deleteExpenseHelper();
		},
		() => {
			onExpand();
		},
		isDeleting
	);

	return (
		<>
			<div className={classes("")}>
				<div className={classes("-main")} onClick={onExpand}>
					<div className={classes("-icon")}>
						{WalletUtils.getIcon(
							expense.tags || [],
							expense.title,
							classes("-icon"),
							expense.icon
						)}
					</div>
					<Typography size="sm" className={classes("-date")}>
						{dayjs(expense.timestamp).format("MMM DD, HH:mm")}
					</Typography>
					<Typography
						size={device === "mobile" ? "md" : "sm"}
						className={classes("-title")}
					>
						{expense.title}
					</Typography>
					<div className={classes("-splits")}>
						{expense.splits &&
						expense.splits.length > 0 &&
						!expanded ? (
							<Avatars
								limit={2}
								size={device === "mobile" ? 16 : 24}
							>
								{expense.splits.map((exp) => ({
									src: getUserDetails(exp.user).avatar || "",
									alt:
										(getUserDetails(exp.user).name || "") +
										" - " +
										(exp.pending + exp.completed),
								}))}
							</Avatars>
						) : null}
					</div>
					<Typography
						size={device === "mobile" ? "lg" : "md"}
						weight="medium"
						className={classes("-amount")}
						style={{
							color: `var(--${expenseTypes[expense.type].theme}-500)`,
						}}
					>
						{Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "INR",
							minimumFractionDigits: 0,
						})
							.format(expense.amount)
							.replace("₹", "")}
					</Typography>
				</div>
				{expanded ? (
					<div className={classes("-info")}>
						{expense.description ? (
							<Typography size="sm" as="p">
								{expense.description}
							</Typography>
						) : null}
						<div className={classes("-transfer")}>
							<div className={classes("-tags")}>
								{expense.tags?.map((tag) => (
									<Tag
										key={`expense-${expense.id}-tag-${tag}`}
										tag={tag}
									/>
								))}
							</div>
							<div className={classes("-actions")}>
								{expense.author.id === loggedInUser?.id ? (
									<button
										className={classes("-actions__action")}
										onClick={() => {
											deleteExpenseConfirmation.openPopup();
										}}
									>
										<FiTrash />
									</button>
								) : null}
							</div>
						</div>
						{expense.splits && expense.splits.length > 0 ? (
							<div className={classes("-info-splits")}>
								{expense.splits.map((split, index) => (
									<ExpenseRowSplit
										key={`expense-${expense.id}-split-${index}`}
										expense={expense}
										split={split}
										onUpdate={sync}
									/>
								))}
							</div>
						) : null}
					</div>
				) : null}
			</div>
			{deleteExpenseConfirmation.showPopup
				? deleteExpenseConfirmation.Modal
				: null}
		</>
	);
};
