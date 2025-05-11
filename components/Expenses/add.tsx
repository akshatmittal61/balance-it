import { expenseMethods, expenseTypes } from "@/constants";
import { Responsive } from "@/layouts";
import {
	Button,
	CheckBox,
	FabButton,
	IconButton,
	Input,
	Pane,
	Textarea,
	Typography,
} from "@/library";
import { useAuthStore, useWalletStore } from "@/store";
import { CreateExpense, T_EXPENSE_TYPE } from "@/types";
import { Notify, stylesConfig } from "@/utils";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useState } from "react";
import {
	FiChevronLeft,
	FiChevronUp,
	FiPlus,
	FiUsers,
	FiX,
} from "react-icons/fi";
import { distributionMethods, ExpenseUser, MembersWindow } from "./splits";
import styles from "./styles.module.scss";
import { AddExpenseScreen, AddExpenseWizardProps, TagProps } from "./types";

const classes = stylesConfig(styles, "expense-wizard");

const Tag: React.FC<TagProps> = ({
	tag,
	active = true,
	onClick,
	onRemove,
	className = "",
}) => {
	return (
		<span
			className={classes(
				"-tag",
				{
					"-tag--active": active,
					"-tag--interactive": onClick !== undefined,
				},
				className
			)}
			onClick={onClick}
		>
			{tag}
			{onRemove ? <FiX onClick={onRemove} /> : null}
		</span>
	);
};

export const AddExpenseWizard: React.FC<AddExpenseWizardProps> = () => {
	const { user } = useAuthStore();
	const { isAdding, createExpense, tags } = useWalletStore();
	const [openAddWizard, setOpenAddWizard] = useState(false);
	const [expandAdditionInfo, setExpandAdditionInfo] = useState(false);
	const [tagsStr, setTagsStr] = useState("");
	const [currentScreen, setCurrentScreen] =
		useState<AddExpenseScreen>("default");
	const [members, setMembers] = useState<Array<ExpenseUser>>(
		user ? [{ ...user, amount: 0, value: 0 }] : []
	);
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
		setTagsStr("");
		setCurrentScreen("default");
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		payload.tags = tagsStr
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
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
			setOpenAddWizard(false);
			handleReset();
		} catch (error) {
			Notify.error(error);
		}
	};
	const handleClose = () => {
		setCurrentScreen("default");
		setOpenAddWizard(false);
	};
	const handleTypeSelect = (type: T_EXPENSE_TYPE) => {
		setPayload((prev) => ({ ...prev, type }));
		setOpenAddWizard(true);
	};
	return (
		<>
			{openAddWizard ? (
				<Pane
					title={`Add Expense - ${expenseTypes[payload.type].label}`}
					onClose={handleClose}
					direction="bottom"
				>
					<form onSubmit={handleSubmit} className={classes("-form")}>
						<Responsive.Row>
							{currentScreen === "default" ? (
								<>
									<Responsive.Col
										xlg={50}
										lg={50}
										md={50}
										sm={100}
										xsm={100}
									>
										<Input
											name="title"
											type="text"
											label="Title"
											placeholder="Title e.g. Food"
											value={payload.title}
											onChange={handleChange}
											required
										/>
									</Responsive.Col>
									<Responsive.Col
										xlg={50}
										lg={50}
										md={50}
										sm={100}
										xsm={100}
									>
										<Input
											name="amount"
											label="Amount"
											placeholder="Amount e.g. 100"
											value={payload.amount}
											onChange={handleChange}
											required
										/>
									</Responsive.Col>
									<div
										onClick={() =>
											setExpandAdditionInfo((p) => !p)
										}
									>
										<div className={classes("-additional")}>
											<Typography size="lg">
												Additional Information
											</Typography>
											<IconButton
												type="button"
												icon={
													<FiChevronUp
														style={{
															transform:
																expandAdditionInfo
																	? "rotate(180deg)"
																	: "rotate(0deg)",
														}}
													/>
												}
											/>
										</div>
									</div>
									{expandAdditionInfo ? (
										<>
											<Responsive.Col
												xlg={33}
												lg={33}
												md={50}
												sm={50}
												xsm={50}
											>
												<Input
													name="tagsStr"
													type="text"
													label="Tags"
													placeholder="Title e.g. Food, Travel, Grocery"
													value={tagsStr}
													onChange={(e: any) =>
														setTagsStr(
															e.target.value
														)
													}
												/>
											</Responsive.Col>
											<Responsive.Col
												xlg={33}
												lg={33}
												md={50}
												sm={50}
												xsm={50}
											>
												<Input
													name="timestamp"
													type="datetime-local"
													placeholder=""
													label="Date / Time"
													value={dayjs(
														payload.timestamp
													).format(
														"YYYY-MM-DDTHH:mm"
													)}
													onChange={handleChange}
													required
												/>
											</Responsive.Col>
											{tagsStr
												.split(",")
												.map((tag: string) =>
													tag.trim()
												)
												.filter(Boolean).length > 0 ? (
												<Responsive.Col
													xlg={100}
													lg={100}
													md={100}
													sm={100}
													xsm={100}
													className={classes("-tags")}
												>
													{tagsStr
														.split(",")
														.map((tag: string) =>
															tag.trim()
														)
														.filter(Boolean)
														.map(
															(
																tag: string,
																index: number
															) => (
																<Tag
																	tag={tag}
																	active={
																		true
																	}
																	key={`add-expense-tag-${index}`}
																	onRemove={() => {
																		const currentTags =
																			tagsStr
																				.split(
																					","
																				)
																				.map(
																					(
																						tag
																					) =>
																						tag.trim()
																				)
																				.filter(
																					Boolean
																				);
																		setTagsStr(
																			currentTags
																				.filter(
																					(
																						t
																					) =>
																						t !==
																						tag
																				)
																				.join(
																					", "
																				)
																		);
																	}}
																/>
															)
														)}
												</Responsive.Col>
											) : null}
											<Responsive.Col
												xlg={100}
												lg={100}
												md={100}
												sm={100}
												xsm={100}
												className={classes("-tags")}
											>
												{tags
													.map((tag: string) =>
														tag.trim()
													)
													.filter(Boolean)
													.filter(
														(tag: string) =>
															!tagsStr
																.split(",")
																.map((tag) =>
																	tag.trim()
																)
																.includes(tag)
													)
													.map(
														(
															tag: string,
															index: number
														) => (
															<Tag
																tag={tag}
																active={false}
																key={`add-expense-tag-${index}`}
																onClick={() => {
																	const currentTags =
																		tagsStr
																			.split(
																				","
																			)
																			.map(
																				(
																					tag
																				) =>
																					tag.trim()
																			)
																			.filter(
																				Boolean
																			);
																	if (
																		currentTags.includes(
																			tag
																		)
																	)
																		return;
																	setTagsStr(
																		[
																			...currentTags,
																			tag,
																		].join(
																			", "
																		)
																	);
																}}
															/>
														)
													)}
											</Responsive.Col>
											<Responsive.Col
												xlg={100}
												lg={100}
												md={100}
												sm={100}
												xsm={100}
												className={classes("-methods")}
											>
												{Object.values(
													expenseMethods
												).map((method) => (
													<CheckBox
														key={`add-expense-payment-method-${method.id}`}
														label={
															<Image
																src={
																	method.logo
																}
																alt={
																	method.label
																}
																width={50}
																height={50}
																className={classes(
																	"-methods-logo"
																)}
															/>
														}
														checked={
															payload.method ===
															method.id
														}
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
										</>
									) : null}
								</>
							) : currentScreen === "splits" ? (
								<MembersWindow
									defaultMethod={distributionMethods.equal}
									totalAmount={payload.amount}
									members={members}
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
							) : null}
							<Responsive.Col
								xlg={100}
								lg={100}
								md={100}
								sm={100}
								xsm={100}
								className={classes("-action")}
							>
								{payload.amount > 0 ? (
									currentScreen === "default" ? (
										<Button
											type="button"
											size="large"
											variant="outlined"
											onClick={() => {
												if (!payload.title) {
													return Notify.error(
														"Please enter a title"
													);
												}
												setCurrentScreen("splits");
											}}
											icon={<FiUsers />}
											iconPosition="left"
										>
											Split with friends?
										</Button>
									) : (
										<Button
											type="button"
											size="large"
											variant="outlined"
											onClick={() =>
												setCurrentScreen("default")
											}
											icon={<FiChevronLeft />}
											iconPosition="left"
										>
											Go back
										</Button>
									)
								) : null}
								<Button
									type="submit"
									size="large"
									loading={isAdding}
									title={(() => {
										if (isAdding) return "Creating...";
										if (payload.amount <= 0)
											return "Enter Amount";
										if (members.length > 0) {
											// the only member is the logged in user
											if (
												members.length === 1 &&
												members[0].id === user?.id
											) {
												return "Create";
											}
											// some members have 0 amount
											if (
												members.some(
													(m) => m.amount === 0
												)
											) {
												return "Enter Amount for all members";
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
								>
									Add
								</Button>
							</Responsive.Col>
						</Responsive.Row>
					</form>
				</Pane>
			) : null}
			<FabButton
				icon={<FiPlus />}
				options={Object.values(expenseTypes).map((o) => ({
					id: o.id,
					icon: <o.Icon size={16} />,
					label: o.label,
					onSelect: (id) => handleTypeSelect(id as T_EXPENSE_TYPE),
				}))}
				onClick={() => setOpenAddWizard(true)}
			/>
		</>
	);
};
