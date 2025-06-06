import { IUser } from "@/types";

export type DistributionMethod =
	| "equal"
	| "percentage"
	| "shares"
	| "fraction"
	| "custom";

export type ExpenseUser = IUser & {
	amount: number;
	value: number | string;
};

export type DistributionMemberProps = {
	member: ExpenseUser;
	distributionMethod: DistributionMethod;
	onChange: (_: string | number, __: DistributionMethod) => void;
};

export type EqualDistributionProps = {
	member: ExpenseUser;
};

export type PercentageDistributionProps = {
	member: ExpenseUser;
	onChange: (_: string | number) => void;
};

export type SharesDistributionProps = {
	member: ExpenseUser;
	onChange: (_: number) => void;
};

export type FractionDistributionProps = {
	member: ExpenseUser;
	onChange: (_: string | number) => void;
};

export type CustomDistributionProps = {
	member: ExpenseUser;
	onChange: (_: string | number) => void;
};
