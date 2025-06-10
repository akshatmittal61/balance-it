import { WalletApi } from "@/api";
import {
	initialExpensesSummary,
	initialWalletDashboardOptions,
	initialWalletFilterOptions,
} from "@/constants";
import { useHttpClient } from "@/hooks";
import {
	CreateExpense,
	ExpenseSpread,
	ExpensesSummary,
	WalletDashboardOptions,
	WalletFilterOptions,
} from "@/types";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createSelectors } from "./utils";

type State = {
	expenses: Array<ExpenseSpread>;
	summary: ExpensesSummary;
	tags: Array<string>;
	filterOptions: WalletFilterOptions;
	filters: WalletDashboardOptions["filters"];
	sort: WalletDashboardOptions["sort"];
	pagination: WalletDashboardOptions["pagination"];
};

type Getter<T extends keyof State> = () => State[T];
type Setter<T extends keyof State> = (_: State[T]) => void;

type Action = {
	getExpenses: Getter<"expenses">;
	getSummary: Getter<"summary">;
	getTags: Getter<"tags">;
	getFilterOptions: Getter<"filterOptions">;
	getFilters: Getter<"filters">;
	getSort: Getter<"sort">;
	getPagination: Getter<"pagination">;
	setExpenses: Setter<"expenses">;
	setSummary: Setter<"summary">;
	setFilterOptions: Setter<"filterOptions">;
	setFilters: Setter<"filters">;
	setSort: Setter<"sort">;
	setPagination: Setter<"pagination">;
};

type Store = State & Action;

const store = create<Store>((set, get) => {
	return {
		expenses: [],
		summary: initialExpensesSummary,
		tags: [],
		filterOptions: initialWalletFilterOptions,
		filters: initialWalletDashboardOptions.filters,
		sort: initialWalletDashboardOptions.sort,
		pagination: initialWalletDashboardOptions.pagination,
		getExpenses: () => get().expenses,
		getSummary: () => get().summary,
		getTags: () => get().tags,
		getFilterOptions: () => get().filterOptions,
		getFilters: () => get().filters,
		getSort: () => get().sort,
		getPagination: () => get().pagination,
		setExpenses: (expenses) => {
			const allTags = expenses.reduce((acc, expense) => {
				return [...acc, ...(expense.tags || [])];
			}, [] as string[]);
			const uniqueTags = Array.from(new Set(allTags));
			set({ expenses, tags: uniqueTags.sort() });
		},
		setSummary: (summary) => set({ summary }),
		setFilterOptions: (filterOptions) => set({ filterOptions }),
		setFilters: (filters) => set({ filters }),
		setSort: (sort) => set({ sort }),
		setPagination: (pagination) => set({ pagination }),
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
			const [expensesRes, filterOptionsRes] = await Promise.all([
				WalletApi.getUserExpenses({
					filters: store.getFilters(),
					sort: store.getSort(),
					pagination: store.getPagination(),
				}),
				WalletApi.getFilterOptions(),
			]);
			store.setExpenses(expensesRes.data.data);
			store.setFilterOptions(filterOptionsRes.data);
		} catch {
			store.setExpenses([]);
		} finally {
			setIsLoading(false);
		}
	};

	const createExpense = async (expense: CreateExpense) => {
		const created = await addApi(WalletApi.createExpense, expense);
		store.setExpenses([created, ...store.expenses]);
		sync();
	};

	const deleteExpense = async (id: string) => {
		await deleteApi(WalletApi.deleteExpense, id);
		store.setExpenses(
			store.expenses.filter((expense) => expense.id !== id)
		);
		sync();
	};

	const setFilters = (filters: WalletDashboardOptions["filters"]) => {
		store.setFilters(filters);
		sync();
	};

	const setSort = (sort: WalletDashboardOptions["sort"]) => {
		store.setSort(sort);
		sync();
	};

	const setPagination = (
		pagination: WalletDashboardOptions["pagination"]
	) => {
		store.setPagination(pagination);
		sync();
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
		setFilters,
		setSort,
		setPagination,
	};
};
