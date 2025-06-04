import {
	expenseMethods,
	expenseTypes,
	navigationMap,
	routes,
} from "@/constants";
import { useDebounce, useDevice } from "@/hooks";
import { Responsive } from "@/layouts";
import {
	Avatar,
	Avatars,
	Button,
	CheckBox,
	IconButton,
	Input,
	Pane,
	Textarea,
	Typography,
} from "@/library";
import { Logger } from "@/log";
import { useAuthStore, useHeader, useWalletStore } from "@/store";
import { CreateExpense } from "@/types";
import { getUserDetails, Notify, stylesConfig } from "@/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { BsChevronCompactUp } from "react-icons/bs";
import { FiCalendar, FiUsers } from "react-icons/fi";
import { DoneAnimation } from "./done";
import { distributionMethods, ExpenseUser, MembersWindow } from "./splits";
import styles from "./styles.module.scss";
import { AddTag, Tag } from "./tags";
import { AddExpenseWizardProps } from "./types";
import { inferTagsFromTitle } from "./utils";

export const classes = stylesConfig(styles, "expense-wizard");

export const AddExpenseWizard: React.FC<AddExpenseWizardProps> = () => {
	const router = useRouter();
	const { user } = useAuthStore();
	const { isAdding, createExpense } = useWalletStore();
	const { device } = useDevice();
	const [expandAdditionInfo, setExpandAdditionInfo] = useState(false);
	const [isAdded, setIsAdded] = useState(false);
	const [manageSplits, setManageSplits] = useState<boolean>(false);
	const [members, setMembers] = useState<Array<ExpenseUser>>(
		user ? [{ ...user, amount: 0, value: 0 }] : []
	);
	const amountInputRef = useRef<HTMLInputElement>(null);
	const titleInputRef = useRef<HTMLInputElement>(null);
	const timestampInputRef = useRef<HTMLInputElement>(null);
	const [payload, setPayload] = useState<CreateExpense>({
		title: "",
		amount: 0,
		tags: [],
		timestamp: new Date().toISOString(),
		splits: [],
		icon: "",
		description: "",
		type: expenseTypes.PAID.id,
		method: "UPI",
		author: user ? user.id : "",
	});
	const [rawTitle, debouncedTitle, setRawTitle] = useDebounce("", 500);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name;
		const value = e.target.value;
		if (name === "timestamp") {
			setPayload((p) => ({
				...p,
				[name]: new Date(value).toISOString(),
			}));
		} else if (name === "amount") {
			if (value.startsWith("0") && value.length > 1) {
				setPayload({ ...payload, [name]: +value.slice(1) });
			} else {
				setPayload({ ...payload, [name]: +value });
			}
		} else {
			setPayload((p) => ({ ...p, [name]: value }));
		}
	};
	const handleReset = () => {
		setPayload({
			title: "",
			amount: 0,
			tags: [],
			timestamp: new Date().toISOString(),
			splits: [],
			icon: "",
			description: "",
			type: expenseTypes.PAID.id,
			method: "UPI",
			author: user ? user.id : "",
		});
		setMembers(user ? [{ ...user, amount: 0, value: 0 }] : []);
	};
	const onSave = async () => {
		Logger.debug("payload", payload);
		if (payload.splits !== undefined) {
			if (payload.splits.length === 0) {
				delete payload.splits;
			}
			if (
				payload.splits?.length === 1 &&
				payload.splits[0].user === user?.id
			) {
				delete payload.splits;
			}
		}
		try {
			await createExpense(payload);
			setIsAdded(true);
			router.push(routes.HOME);
			handleReset();
		} catch (error) {
			Notify.error(error);
		}
	};

	useHeader(
		[navigationMap.home],
		debouncedTitle.length > 0 && payload.amount > 0 ? (
			<Typography size="sm" style={{ fontStyle: "italic" }}>
				{dayjs(payload.timestamp).format("MMM DD, HH:mm")}
			</Typography>
		) : null
	);

	// Tags auto suggestion
	useEffect(() => {
		if (!debouncedTitle) return;
		const tags = inferTagsFromTitle(debouncedTitle);
		setPayload((prev) => ({
			...prev,
			title: debouncedTitle,
			tags: Array.from(new Set([...(prev.tags || []), ...tags])),
		}));
	}, [debouncedTitle]);

	if (isAdded) {
		return <DoneAnimation />;
	}

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (titleInputRef && titleInputRef.current) {
						titleInputRef.current.blur();
					}
					if (amountInputRef && amountInputRef.current) {
						amountInputRef.current.blur();
					}
				}}
				className={classes("-form")}
			>
				<div className={classes("-avatars")}>
					{members.length > 0 &&
					!(members.length === 1 && members[0].id === user?.id) ? (
						<Avatars size={48} limit={3}>
							{members.map((m) => ({
								src: getUserDetails(m).avatar || "",
								alt: getUserDetails(m).name || "",
							}))}
						</Avatars>
					) : user ? (
						<Avatar
							src={getUserDetails(user).avatar || ""}
							alt={getUserDetails(user).name || ""}
							size={48}
						/>
					) : null}
				</div>
				<Input
					size={device === "mobile" ? "large" : "medium"}
					name="amount"
					placeholder="0"
					value={payload.amount === 0 ? "" : payload.amount}
					onChange={handleChange}
					className={classes("-amount")}
					autoFocus
					required
					ref={amountInputRef}
					styles={{
						input: {
							width: "fit-content",
							borderBottom: "none",
							maxWidth: "7ch",
						},
						container: {
							width: "fit-content",
							maxWidth: "7ch",
						},
						box: {
							width: "fit-content",
						},
					}}
				/>
				<Input
					size={device === "mobile" ? "large" : "medium"}
					name="title"
					type="text"
					placeholder="Add a note"
					value={rawTitle}
					onChange={(e: any) => setRawTitle(e.target.value)}
					required
					ref={titleInputRef}
					className={classes("-title")}
					styles={{
						input: {
							borderBottom: "none",
						},
					}}
				/>
				<button type="submit" className="dispn">
					Save
				</button>
			</form>
			{debouncedTitle.length > 0 && payload.amount > 0 ? (
				<div className={classes("-tags")}>
					{payload.tags && payload.tags.length > 0
						? payload.tags.map((tag: string) => (
								<Tag
									key={`add-expense-tag-${tag}`}
									tag={tag}
									onRemove={() => {
										setPayload((p) => ({
											...p,
											tags: p.tags?.filter(
												(t) => t !== tag
											),
										}));
									}}
								/>
							))
						: null}
					<AddTag
						onAdd={(tag: string) => {
							if (tag.trim().length < 3) {
								return;
							}
							setPayload((p) => ({
								...p,
								tags: [...(p.tags || []), tag],
							}));
						}}
					/>
				</div>
			) : null}
			{payload.title.length > 0 && payload.amount > 0 ? (
				<div className={classes("-members")}>
					<MembersWindow
						defaultMethod={distributionMethods.equal.id}
						totalAmount={payload.amount}
						members={members}
						isSplitsManagerOpen={manageSplits}
						onCloseSplitsManager={() => setManageSplits(false)}
						setMembers={(users) => {
							setMembers(users);
							setPayload((p) => ({
								...p,
								splits: users.map((user) => ({
									user: user.id,
									amount: user.amount,
								})),
							}));
						}}
					/>
				</div>
			) : null}
			{expandAdditionInfo ? (
				<Pane
					onClose={() => {
						setExpandAdditionInfo(false);
					}}
					height="50vh"
					direction={device === "mobile" ? "bottom" : "right"}
				>
					<Responsive.Row className={classes("-additional")}>
						<Responsive.Col
							xlg={100}
							lg={100}
							md={100}
							sm={100}
							xsm={100}
							className={classes("-methods")}
						>
							{Object.values(expenseMethods).map((method) => (
								<CheckBox
									key={`add-expense-payment-method-${method.id}`}
									label={
										<Image
											src={method.logo}
											alt={method.label}
											width={50}
											height={50}
											className={classes("-methods-logo")}
										/>
									}
									checked={payload.method === method.id}
									onChange={() => {
										setPayload((p) => ({
											...p,
											method: method.id,
										}));
									}}
								/>
							))}
						</Responsive.Col>
						<Responsive.Col
							xlg={100}
							lg={100}
							md={100}
							sm={100}
							xsm={100}
						>
							<Textarea
								name="description"
								label="Note"
								placeholder="Add a note for your expense"
								value={payload.description}
								onChange={(e: any) => {
									handleChange(e);
								}}
								rows={4}
							/>
						</Responsive.Col>
					</Responsive.Row>
				</Pane>
			) : null}
			{payload.title.length > 0 && payload.amount > 0 ? (
				<div className={classes("-bottom-bar")}>
					{isAdding ? null : (
						<>
							<div className={classes("-bottom-bar__options")}>
								<IconButton
									icon={<FiUsers />}
									onClick={() => {
										setManageSplits(true);
									}}
									disabled={(() => {
										if (isAdding) return true;
										if (payload.amount <= 0) return true;
										if (members.length > 0) {
											if (
												members.length === 1 &&
												members[0].id === user?.id
											) {
												return false;
											}
											// some members have 0 amount
											if (
												members.some(
													(m) => m.amount === 0
												)
											) {
												return true;
											}
											// if the total amount is not equal to sum of members split
											if (
												members
													.map((user) => user.amount)
													.reduce(
														(a, b) => a + b,
														0
													) !== payload.amount
											) {
												return true;
											}
										}
									})()}
								/>
								<IconButton
									icon={<BsChevronCompactUp />}
									size="large"
									onClick={() => {
										setExpandAdditionInfo(true);
									}}
								/>
								<>
									<input
										name="timestamp"
										id="timestamp"
										type="datetime-local"
										placeholder=""
										value={dayjs(payload.timestamp).format(
											"YYYY-MM-DDTHH:mm"
										)}
										onChange={handleChange}
										required
										ref={timestampInputRef}
										className="dispn"
									/>
									<label
										htmlFor="timestamp"
										onClick={() => {
											if (
												timestampInputRef &&
												timestampInputRef.current
											) {
												try {
													timestampInputRef.current.showPicker();
												} catch {
													Logger.error(
														"Unable to show picker"
													);
												}
											}
										}}
									>
										<IconButton icon={<FiCalendar />} />
									</label>
								</>
							</div>
						</>
					)}
					<Button
						loading={isAdding}
						size="large"
						className={classes("-bottom-bar__cta")}
						onClick={(e: any) => {
							e.preventDefault();
							onSave();
						}}
						title={(() => {
							if (isAdding) return "Creating...";
							if (payload.amount <= 0) return "Enter Amount";
							if (members.length > 0) {
								// the only member is the logged in user
								if (
									members.length === 1 &&
									members[0].id === user?.id
								) {
									return "Create";
								}
								// some members have 0 amount
								if (members.some((m) => m.amount === 0)) {
									return "Enter Amount for all members";
								}
								// if the total amount is not equal to sum of members split
								if (
									members
										.map((user) => user.amount)
										.reduce((a, b) => a + b, 0) !==
									payload.amount
								) {
									return "Enter Amount for all members";
								}
							}
							return "Create";
						})()}
						disabled={(() => {
							if (isAdding) return true;
							if (payload.amount <= 0) return true;
							if (members.length > 0) {
								if (
									members.length === 1 &&
									members[0].id === user?.id
								) {
									return false;
								}
								// some members have 0 amount
								if (members.some((m) => m.amount === 0)) {
									return true;
								}
								// if the total amount is not equal to sum of members split
								if (
									members
										.map((user) => user.amount)
										.reduce((a, b) => a + b, 0) !==
									payload.amount
								) {
									return true;
								}
							}
						})()}
					>
						Add Expense for{" "}
						{Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "INR",
						}).format(payload.amount)}
					</Button>
				</div>
			) : null}
		</>
	);
};
