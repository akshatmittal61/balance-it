import { expenseMethods, expenseTypes } from "@/constants";
import { useConfirmationModal } from "@/hooks";
import { Avatar, Avatars, Pill, Typography } from "@/library";
import { useAuthStore, useWalletStore } from "@/store";
import { ExpenseSpread, ISplit } from "@/types";
import { getUserDetails, Notify, roundOff, stylesConfig } from "@/utils";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useState } from "react";
import { FiTrash } from "react-icons/fi";
import styles from "./styles.module.scss";

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
	const { pending, completed, user } = split;
	const [settling, setSettling] = useState(false);
	const settleMember = async () => {
		try {
			setSettling(true);
			/* const updatedMembersRes = await MemberApi.settleMemberInExpense({
				groupId: expense.group.id,
				expenseId: expense.id,
				memberId: id,
			});
			onUpdateMembers(updatedMembersRes.data); */
			onUpdate();
		} catch (error) {
			Notify.error(error);
		} finally {
			setSettling(false);
		}
	};
	return (
		<div
			className={classes("-split", {
				"-split--owed": pending > 0,
				"-split--settling": settling,
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
							{`${expense.author.name || expense.author.email.slice(0, 7) + "..."} paid ${roundOff(completed, 2)} for this expense`}
						</Typography>
					);
				} else {
					if (pending === 0) {
						return (
							<Typography size="sm">
								{`${user.name || user.email.slice(0, 7) + "..."} has paid ${roundOff(completed, 2)} to ${expense.author.name || expense.author.email.slice(0, 7) + "..."}`}
							</Typography>
						);
					} else {
						return (
							<Typography size="sm">
								{`${user.name || user.email.slice(0, 7) + "..."} owes ${roundOff(pending, 2)} to ${expense.author.name || expense.author.email.slice(0, 7) + "..."}`}
							</Typography>
						);
					}
				}
			})()}
			{expense.author.id === loggedInUser?.id ? (
				<button
					disabled={pending === 0 || settling}
					className={classes("-split-btn", {
						"-split-btn--settled": pending === 0,
					})}
					onClick={settleMember}
				>
					{pending === 0 ? (
						"Settled"
					) : settling ? (
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
					<Typography size="sm" className={classes("-date")}>
						{dayjs(expense.timestamp).format("MMM DD, HH:mm")}
					</Typography>
					<Typography size="sm" className={classes("-title")}>
						{expense.title}
					</Typography>
					{expense.splits &&
					expense.splits.length > 0 &&
					!expanded ? (
						<div className={classes("-splits")}>
							<Avatars size={24}>
								{expense.splits.map((exp) => ({
									src: getUserDetails(exp.user).avatar || "",
									alt:
										(getUserDetails(exp.user).name || "") +
										" - " +
										(exp.pending + exp.completed),
								}))}
							</Avatars>
						</div>
					) : null}
					<Typography
						size="s"
						weight="medium"
						className={classes("-amount")}
						style={{
							color: `var(--${expenseTypes[expense.type].theme}-500)`,
						}}
					>
						{expense.amount}
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
							{(() => {
								const type = expenseTypes[expense.type];
								return (
									<Pill
										icon={<type.Icon />}
										label={type.label}
										theme={type.theme}
									/>
								);
							})()}
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
						<div className={classes("-extra_info")}>
							<div className={classes("-tags")}>
								{expense.tags?.map((tag) => (
									<Pill
										key={`expense-${expense.id}-tag-${tag}`}
										dot={false}
										label={tag}
										theme="metal"
									/>
								))}
							</div>
							{expense.method ? (
								<Image
									src={expenseMethods[expense.method].logo}
									alt={expenseMethods[expense.method].label}
									width={24}
									height={24}
									className={classes("-method-logo")}
								/>
							) : null}
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
