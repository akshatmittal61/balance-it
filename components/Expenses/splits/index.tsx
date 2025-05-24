import { MembersSelector } from "@/components";
import { useDevice } from "@/hooks";
import { Pane } from "@/library";
import { Logger } from "@/log";
import { useAuthStore } from "@/store";
import { IUser } from "@/types";
import React, { useEffect, useState } from "react";
import { classes, distributionMethods } from "./assets";
import { DistributionMember } from "./distribution";
import { DistributionMethod, MembersWindowProps } from "./types";
import { ExpenseUtils } from "./utils";
export * from "./assets";
export * from "./types";

export const MembersWindow: React.FC<MembersWindowProps> = ({
	defaultMethod,
	members,
	setMembers,
	totalAmount,
	isSplitsManagerOpen,
	onCloseSplitsManager,
}) => {
	const [method, setMethod] = useState<DistributionMethod>(
		defaultMethod || distributionMethods.equal
	);
	const { user: loggedInUser } = useAuthStore();
	const { device } = useDevice();

	const handleRemoveUser = (member: IUser) => {
		const newMembers = members
			.filter((m) => m.id !== member.id)
			.map((m) => {
				if (method === distributionMethods.equal.id) {
					const newAmount = ExpenseUtils.getAmount(
						m.value,
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
						...m,
						amount: newAmount,
						value: newValue,
					};
				} else {
					return m;
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
					if (method === distributionMethods.equal.id) {
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
					if (method === distributionMethods.equal.id) {
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
	};

	const handleMethodChange = (newMethod: DistributionMethod) => {
		const oldMethod = method;
		Logger.debug(oldMethod, newMethod);
		const newMembers = members.map((member) => {
			if (newMethod === distributionMethods.equal.id) {
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
		handleMethodChange(method);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalAmount]);

	return (
		<>
			{members.length > 0 &&
			!(members.length === 1 && members[0].id === loggedInUser?.id) ? (
				<div className={classes("-header", "-tabs")}>
					{Object.values(distributionMethods).map((m) => {
						return (
							<div
								key={`distribution-method-tab-${m.id}`}
								className={classes("-tab", {
									"-tab--active": m.id === method,
								})}
								title={m.label}
								onClick={() => {
									handleMethodChange(m.id);
								}}
							>
								{m.icon}
							</div>
						);
					})}
				</div>
			) : null}
			{members.length > 0 &&
			!(members.length === 1 && members[0].id === loggedInUser?.id)
				? members.map((member) => (
						<DistributionMember
							member={member}
							key={`split-manager-user-${member.id}`}
							distributionMethod={method}
							onChange={(
								value: string | number,
								method: DistributionMethod
							) => {
								handleValueChange(value, method, member);
							}}
						/>
					))
				: null}
			{isSplitsManagerOpen ? (
				<Pane
					onClose={onCloseSplitsManager}
					direction={device === "mobile" ? "bottom" : "right"}
				>
					<MembersSelector
						selectedMembers={members}
						onAddMember={handleSelectUser}
						onRemoveMember={handleRemoveUser}
					/>
				</Pane>
			) : null}
		</>
	);
};
