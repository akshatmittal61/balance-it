import { expenseMethods, expenseTypes, routes } from "@/constants";
import { Responsive } from "@/layouts";
import {
	Avatar,
	Avatars,
	Button,
	CheckBox,
	FabButton,
	Input,
	Pane,
	Textarea,
} from "@/library";
import { useAuthStore, useWalletStore } from "@/store";
import { CreateExpense } from "@/types";
import { getUserDetails, Notify, stylesConfig } from "@/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiArrowRight, FiUsers, FiX } from "react-icons/fi";
import { distributionMethods, ExpenseUser, MembersWindow } from "./splits";
import styles from "./styles.module.scss";
import { AddExpenseWizardProps, TagProps } from "./types";

export const classes = stylesConfig(styles, "expense-wizard");

export const Tag: React.FC<TagProps> = ({
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
	const router = useRouter();
	const { user } = useAuthStore();
	const { isAdding, createExpense, tags } = useWalletStore();
	const [expandAdditionInfo, setExpandAdditionInfo] = useState(false);
	const [tagsStr, setTagsStr] = useState("");
	const [enableSplits, setEnableSplits] = useState<boolean>(false);
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
			handleReset();
			router.push(routes.HOME);
		} catch (error) {
			Notify.error(error);
		}
	};
	return (
		<>
			<div className={classes("-avatars")}>
				{members.length > 0 &&
				!(members.length === 1 && members[0].id === user?.id) ? (
					<Avatars size={48}>
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
				size="large"
				name="amount"
				placeholder="0"
				value={payload.amount === 0 ? "" : payload.amount}
				onChange={handleChange}
				className={classes("-amount")}
				autoFocus
				required
				styles={{
					input: {
						borderBottom: "none",
					},
				}}
			/>
			<Input
				size="large"
				name="title"
				type="text"
				placeholder="Add a note"
				value={payload.title}
				onChange={handleChange}
				required
				className={classes("-title")}
				styles={{
					input: {
						borderBottom: "none",
					},
				}}
			/>
			{enableSplits ? (
				<div className={classes("-members")}>
					<MembersWindow
						defaultMethod={distributionMethods.equal.id}
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
				</div>
			) : null}
			{expandAdditionInfo ? (
				<Pane
					onClose={() => {
						setExpandAdditionInfo(false);
					}}
					direction="bottom"
				>
					<form onSubmit={handleSubmit} className={classes("-form")}>
						<Responsive.Row>
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
										setTagsStr(e.target.value)
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
									value={dayjs(payload.timestamp).format(
										"YYYY-MM-DDTHH:mm"
									)}
									onChange={handleChange}
									required
								/>
							</Responsive.Col>
							{tagsStr
								.split(",")
								.map((tag: string) => tag.trim())
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
										.map((tag: string) => tag.trim())
										.filter(Boolean)
										.map((tag: string, index: number) => (
											<Tag
												tag={tag}
												active={true}
												key={`add-expense-tag-${index}`}
												onRemove={() => {
													const currentTags = tagsStr
														.split(",")
														.map((tag) =>
															tag.trim()
														)
														.filter(Boolean);
													setTagsStr(
														currentTags
															.filter(
																(t) => t !== tag
															)
															.join(", ")
													);
												}}
											/>
										))}
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
									.map((tag: string) => tag.trim())
									.filter(Boolean)
									.filter(
										(tag: string) =>
											!tagsStr
												.split(",")
												.map((tag) => tag.trim())
												.includes(tag)
									)
									.map((tag: string, index: number) => (
										<Tag
											tag={tag}
											active={false}
											key={`add-expense-tag-${index}`}
											onClick={() => {
												const currentTags = tagsStr
													.split(",")
													.map((tag) => tag.trim())
													.filter(Boolean);
												if (currentTags.includes(tag))
													return;
												setTagsStr(
													[...currentTags, tag].join(
														", "
													)
												);
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
												className={classes(
													"-methods-logo"
												)}
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
							<Responsive.Col
								xlg={50}
								lg={50}
								md={50}
								sm={50}
								xsm={50}
								className={classes("-action")}
							>
								<Button
									type="button"
									variant="outlined"
									onClick={() => {
										if (!payload.title) {
											return Notify.error(
												"Please enter a title"
											);
										}
										if (payload.amount <= 0) {
											return Notify.error(
												"Please enter an amount"
											);
										}
										setExpandAdditionInfo(false);
										setEnableSplits(true);
									}}
									icon={<FiUsers />}
									iconPosition="left"
								>
									Split with friends?
								</Button>
							</Responsive.Col>
							<Responsive.Col
								xlg={50}
								lg={50}
								md={50}
								sm={50}
								xsm={50}
								className={classes("-action")}
							>
								<Button
									type="submit"
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
			{payload.title.length > 0 && payload.amount > 0 ? (
				<FabButton
					icon={<FiArrowRight />}
					onClick={() => {
						setExpandAdditionInfo(true);
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
				/>
			) : null}
		</>
	);
};
