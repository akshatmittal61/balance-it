import { WalletApi } from "@/api";
import { initialExpensesSummary } from "@/constants";
import { useHttpClient } from "@/hooks";
import { CreateExpense, ExpenseSpread, ExpensesSummary, Split } from "@/types";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createSelectors } from "./utils";

type State = {
	expenses: Array<ExpenseSpread>;
	summary: ExpensesSummary;
	tags: Array<string>;
	splits: Array<Split>;
};

type Getter<T extends keyof State> = () => State[T];
type Setter<T extends keyof State> = (_: State[T]) => void;

type Action = {
	getExpenses: Getter<"expenses">;
	getSummary: Getter<"summary">;
	getTags: Getter<"tags">;
	setExpenses: Setter<"expenses">;
	setSummary: Setter<"summary">;
	setSplits: Setter<"splits">;
};

type Store = State & Action;

const store = create<Store>((set, get) => {
	return {
		expenses: [],
		summary: initialExpensesSummary,
		tags: [],
		splits: [],
		getSplits: () => get().splits,
		setSplits: (splits) => set({ splits }),
		getExpenses: () => get().expenses,
		getSummary: () => get().summary,
		getTags: () => get().tags,
		setExpenses: (expenses) => {
			const allTags = expenses.reduce((acc, expense) => {
				return [...acc, ...(expense.tags || [])];
			}, [] as string[]);
			const uniqueTags = Array.from(new Set(allTags));
			set({ expenses, tags: uniqueTags.sort() });
		},
		setSummary: (summary) => set({ summary }),
	};
});

const useStore = createSelectors(store);

type Options = {
	syncOnMount?: boolean;
};

type ReturnType = Store & {
	isLoading: boolean;
	isAdding: boolean;
	isDeleting: boolean;
	sync: () => void;
	createExpense: (_: CreateExpense) => Promise<void>;
	deleteExpense: (_: string) => Promise<void>;
};

type WalletStoreHook = (_?: Options) => ReturnType;

export const useWalletStore: WalletStoreHook = (options = {}) => {
	const store = useStore();
	const [isLoading, setIsLoading] = useState(false);
	const { loading: isAdding, call: addApi } = useHttpClient<ExpenseSpread>();
	const { loading: isDeleting, call: deleteApi } = useHttpClient<boolean>();

	const sync = async () => {
		try {
			setIsLoading(true);
			const [expenses, summary] = await Promise.all([
				WalletApi.getUserExpenses(),
				WalletApi.getExpensesSummary(),
			]);
			store.setExpenses(expenses.data);
			store.setSummary(summary.data);
		} catch {
			store.setExpenses([]);
			store.setSummary(initialExpensesSummary);
		} finally {
			setIsLoading(false);
		}
	};

	const createExpense = async (expense: CreateExpense) => {
		const created = await addApi(WalletApi.createExpense, expense);
		store.setExpenses([created, ...store.expenses]);
	};

	const deleteExpense = async (id: string) => {
		await deleteApi(WalletApi.deleteExpense, id);
		store.setExpenses(
			store.expenses.filter((expense) => expense.id !== id)
		);
	};

	useEffect(() => {
		if (options.syncOnMount) {
			sync();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options.syncOnMount]);

	return {
		...store,
		isLoading,
		isAdding,
		isDeleting,
		sync,
		createExpense,
		deleteExpense,
	};
};
