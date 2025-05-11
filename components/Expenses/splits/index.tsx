import { UserApi } from "@/api";
import { Loader } from "@/components";
import { useDebounce, useHttpClient } from "@/hooks";
import { Avatar, IconButton, Input, MaterialIcon, Typography } from "@/library";
import { Logger } from "@/log";
import { useAuthStore, useGodownStore } from "@/store";
import { IUser } from "@/types";
import { getUserDetails, runningCase } from "@/utils";
import React, { useEffect, useState } from "react";
import { classes, distributionMethods } from "./assets";
import { BulkEditor } from "./bulk-editor";
import { DistributionMember } from "./distribution";
import { MembersUser } from "./member";
import { SplitsPlaceholder } from "./placeholder";
import { DistributionMethod, ExpenseUser, MembersWindowProps } from "./types";
import { ExpenseUtils } from "./utils";
export * from "./assets";
export * from "./types";

export const MembersWindow: React.FC<MembersWindowProps> = ({
	defaultMethod,
	members,
	setMembers,
	totalAmount,
}) => {
	const [method, setMethod] = useState<DistributionMethod>(
		defaultMethod || distributionMethods.equal
	);
	const { user: loggedInUser } = useAuthStore();
	const { friends } = useGodownStore();
	const [searchResults, setSearchResults] = useState<Array<IUser>>([]);
	const [openBulkEditor, setOpenBulkEditor] = useState(false);
	const { loading: searching, call: api } = useHttpClient<Array<IUser>>([]);
	const [searchStr, debouncedSearchStr, setSearchStr] = useDebounce<string>(
		"",
		1000
	);

	const handleSearch = async (searchStr: any) => {
		const res = await api(UserApi.searchForUsers, searchStr);
		setSearchResults(res);
	};

	const handleRemoveUser = (member: ExpenseUser) => {
		const newMembers = members
			.filter((m) => m.id !== member.id)
			.map((member) => {
				if (method === distributionMethods.equal) {
					const newAmount = ExpenseUtils.getAmount(
						member.value,
						method,
						members.length - 1,
						totalAmount
					);
					const newValue = ExpenseUtils.getFormattedValue(
						newAmount,
						method,
						members.length - 1,
						totalAmount
					);
					return {
						...member,
						amount: newAmount,
						value: newValue,
					};
				} else {
					return member;
				}
			});
		setMembers(newMembers);
	};

	const handleSelectUser = (user: IUser) => {
		const isUserCurrentlySelected = members
			.map((m) => m.id)
			.includes(user.id);
		if (isUserCurrentlySelected) {
			const newCount = members.length - 1;
			const newMembers = members
				.filter((m) => m.id !== user.id)
				.map((member) => {
					if (method === distributionMethods.equal) {
						const newAmount = ExpenseUtils.getAmount(
							member.value,
							method,
							newCount,
							totalAmount
						);
						const newValue = ExpenseUtils.getFormattedValue(
							newAmount,
							method,
							newCount,
							totalAmount
						);
						return {
							...member,
							amount: newAmount,
							value: newValue,
						};
					} else {
						return member;
					}
				});
			setMembers(newMembers);
		} else {
			const newCount = members.length + 1;
			const newMembers = [
				...members.map((member) => {
					if (method === distributionMethods.equal) {
						const newAmount = ExpenseUtils.getAmount(
							member.value,
							method,
							newCount,
							totalAmount
						);
						const newValue = ExpenseUtils.getFormattedValue(
							newAmount,
							method,
							newCount,
							totalAmount
						);
						return {
							...member,
							amount: newAmount,
							value: newValue,
						};
					} else {
						return member;
					}
				}),
				ExpenseUtils.makeExpenseUser(
					user,
					method,
					newCount,
					totalAmount
				),
			];
			setMembers(newMembers);
		}
		setSearchStr("");
	};

	const handleMethodChange = (newMethod: DistributionMethod) => {
		const oldMethod = method;
		Logger.debug(oldMethod, newMethod);
		const newMembers = members.map((member) => {
			if (newMethod === distributionMethods.equal) {
				const newAmount = ExpenseUtils.getAmount(
					member.value,
					newMethod,
					members.length,
					totalAmount
				);
				const newValue = ExpenseUtils.getFormattedValue(
					newAmount,
					newMethod,
					members.length,
					totalAmount
				);
				return {
					...member,
					amount: newAmount,
					value: newValue,
				};
			}
			const value = member.value;
			Logger.debug(value);
			const amount = ExpenseUtils.getAmount(
				value,
				oldMethod,
				members.length,
				totalAmount
			);
			const newValue = ExpenseUtils.getFormattedValue(
				amount,
				newMethod,
				members.length,
				totalAmount
			);
			Logger.debug(amount, newValue);
			return {
				...member,
				value: newValue,
				amount,
			};
		});
		setMethod(newMethod);
		setMembers(newMembers);
	};

	const handleValueChange = (
		value: string | number,
		method: DistributionMethod,
		member: IUser
	) => {
		const amount = ExpenseUtils.getAmount(
			value,
			method,
			members.length,
			totalAmount
		);
		const newValue = ExpenseUtils.getFormattedValue(
			amount,
			method,
			members.length,
			totalAmount
		);
		Logger.debug(amount, newValue);
		const newMembers = members.map((m) => {
			if (m.id === member.id) {
				return {
					...m,
					value,
					amount,
				};
			}
			return m;
		});
		setMembers(newMembers);
	};

	useEffect(() => {
		if (debouncedSearchStr && debouncedSearchStr.length >= 3) {
			handleSearch(debouncedSearchStr);
		} else {
			setSearchResults([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchStr]);

	useEffect(() => {
		handleMethodChange(method);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalAmount]);

	return (
		<>
			<div className={classes("-header")}>
				<Typography size="xxl" weight="medium">
					Members
				</Typography>
				<div className={classes("-header-controls")}>
					{!openBulkEditor ? (
						<Input
							name="email"
							placeholder="Search by email"
							size="small"
							value={searchStr}
							onChange={(e: any) => setSearchStr(e.target.value)}
						/>
					) : null}
					<IconButton
						icon={
							<MaterialIcon
								icon={openBulkEditor ? "list" : "email"}
							/>
						}
						title="Bulk Editor"
						type="button"
						onClick={(e: any) => {
							e.preventDefault();
							setOpenBulkEditor((p) => !p);
						}}
					/>
				</div>
			</div>
			<div className={classes("-header")}>
				<Typography>Split Balance</Typography>
				<div className={classes("-header-controls")}>
					<Input
						placeholder="Equal"
						value={runningCase(method)}
						dropdown={{
							enabled: true,
							options: Object.values(distributionMethods).map(
								(method, index) => ({
									id: `distribution-method-option-${index}`,
									value: method,
									label: runningCase(method),
								})
							),
							onSelect: (option) => {
								handleMethodChange(
									option.value as DistributionMethod
								);
							},
						}}
					/>
				</div>
			</div>
			{openBulkEditor ? (
				<BulkEditor
					selectedMembers={members}
					setSelectedMembers={(users) => {
						const finalMembers = users.map((u) => {
							if (method === distributionMethods.equal) {
								const newAmount = ExpenseUtils.getAmount(
									"",
									method,
									users.length,
									totalAmount
								);
								const newValue = ExpenseUtils.getFormattedValue(
									newAmount,
									method,
									users.length,
									totalAmount
								);
								return {
									...u,
									amount: newAmount,
									value: newValue,
								};
							} else {
								if (members.find((m) => m.email === u.email)) {
									const foundMember = members.find(
										(m) => m.email === u.email
									)!;
									return foundMember;
								} else {
									return ExpenseUtils.makeExpenseUser(
										u,
										method,
										members.length,
										totalAmount
									);
								}
							}
						});
						setMembers(finalMembers);
					}}
				/>
			) : null}
			{debouncedSearchStr.length > 0 ? (
				searching ? (
					<Loader.Spinner />
				) : searchResults.length > 0 ? (
					searchResults.map((user, index) => (
						<MembersUser
							{...user}
							key={`group-manager-searched-user-${user.id}`}
							index={index}
							onSelect={
								loggedInUser && user.id === loggedInUser.id
									? undefined
									: () => handleSelectUser(user)
							}
							isSelected={members
								.map((user) => user.id)
								.includes(user.id)}
						/>
					))
				) : (
					<SplitsPlaceholder
						// no user was found, invitation is expected
						loading={false}
						searchStr={searchStr}
						onInvited={(invitedUser) => {
							setSearchResults([invitedUser]);
							handleSelectUser(invitedUser);
						}}
					/>
				)
			) : (
				members.map((member) => (
					<DistributionMember
						member={member}
						key={`split-manager-user-${member.id}`}
						distributionMethod={method}
						onRemove={
							loggedInUser && member.id === loggedInUser.id
								? undefined
								: () => handleRemoveUser(member)
						}
						onChange={(
							value: string | number,
							method: DistributionMethod
						) => {
							handleValueChange(value, method, member);
						}}
					/>
				))
			)}
			{friends.length > 0 ? (
				<div className={classes("-suggestions")}>
					{friends.map((friend) => (
						<div
							key={`add-suggestion-${friend.id}`}
							className={classes("-suggestion", {
								"-suggestion--active": members.find(
									(m) => m.email === friend.email
								)
									? true
									: false,
							})}
							onClick={() => {
								handleSelectUser(friend);
							}}
						>
							<Avatar
								src={getUserDetails(friend).avatar || ""}
								alt={getUserDetails(friend).name || ""}
								size={24}
							/>
							<div className={classes("-suggestion-details")}>
								<Typography
									size="s"
									className={classes("-suggestion-name")}
								>
									{getUserDetails(friend).name}
								</Typography>
								<Typography
									size="sm"
									className={classes("-suggestion-email")}
								>
									{friend.email}
								</Typography>
							</div>
						</div>
					))}
				</div>
			) : null}
		</>
	);
};
