import { ExpenseSpread } from "./client";
import { T_EXPENSE_TYPE } from "./enum";

export type ExpensesBucket = {
	month: string;
	year: string;
	expenses: Array<ExpenseSpread>;
	total: number;
	type: T_EXPENSE_TYPE;
};
