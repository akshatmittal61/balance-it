import { ExpenseSpread } from "./client";
import { T_EXPENSE_TYPE } from "./enum";

export type ExpensesSummary = {
	paid: number;
	received: number;
};

export type ExpensesBucket = {
	month: string;
	year: string;
	expenses: Array<ExpenseSpread>;
	total: number;
	type: T_EXPENSE_TYPE;
};

export type WalletFilterOptions = {
	amount: {
		min: number;
		max: number;
	};
	timestamp: {
		begin: string;
		end: string;
	};
	tags: Array<{ tag: string; count: number }>;
	types: Array<{ type: string; count: number }>;
	methods: Array<{ method: string; count: number }>;
};

export type WalletDisplayOptions = {
	filters?: Pick<WalletFilterOptions, "amount" | "timestamp" | "tags">;
	sort?: {
		field: "timestamp" | "amount";
		order: 1 | -1;
	};
	pagination?: {
		page: number;
		limit: number;
	};
};
