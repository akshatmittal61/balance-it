import { IUser } from "@/types";

export type DistributionMethod = "equal" | "percentage" | "fraction" | "custom";

export type ExpenseUser = IUser & {
	amount: number;
	value: number | string;
};

export type DistributionMemberProps = {
	member: ExpenseUser;
	distributionMethod: DistributionMethod;
	onChange: (_: string | number, __: DistributionMethod) => void;
	onRemove?: () => void;
};

export type EqualDistributionProps = {
	member: ExpenseUser;
};

export type PercentageDistributionProps = {
	member: ExpenseUser;
	onChange: (_: string | number) => void;
};

export type FractionDistributionProps = {
	member: ExpenseUser;
	onChange: (_: string | number) => void;
};

export type CustomDistributionProps = {
	member: ExpenseUser;
	onChange: (_: string | number) => void;
};
