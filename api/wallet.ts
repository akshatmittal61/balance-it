import { http } from "@/connections";
import {
	ApiRequests,
	ApiRes,
	ApiResponses,
	CreateExpense,
	WalletDashboardOptions,
} from "@/types";

export class WalletApi {
	public static async getUserExpenses(
		options: WalletDashboardOptions,
		headers?: any
	) {
		const res = await http.post<
			ApiRes<ApiResponses.GetUserExpenses>,
			ApiRequests.WalletDashboardOptions
		>("/wallet/expenses", options, { headers });
		return res.data;
	}
	public static async getExpenseForUser(expenseId: string, headers?: any) {
		const res = await http.get<ApiRes<ApiResponses.GetExpenseById>>(
			`/wallet/expense?id=${expenseId}`,
			{ headers }
		);
		return res.data;
	}
	public static async getExpensesSummary(headers?: any) {
		const res = await http.get<ApiRes<ApiResponses.GetExpensesSummary>>(
			"/wallet/expenses/summary",
			{ headers }
		);
		return res.data;
	}
	public static async getFilterOptions(headers?: any) {
		const res = await http.get<ApiRes<ApiResponses.WalletFilterOptions>>(
			"/wallet/filters",
			{ headers }
		);
		return res.data;
	}
	public static async createExpense(payload: CreateExpense, headers?: any) {
		const res = await http.post<
			ApiRes<ApiResponses.CreateExpense>,
			ApiRequests.CreateExpense
		>("/wallet/expense", payload, { headers });
		return res.data;
	}
	public static async deleteExpense(expenseId: string, headers?: any) {
		const response = await http.delete<ApiRes<ApiResponses.DeleteExpense>>(
			`/wallet/expense?id=${expenseId}`,
			{ headers }
		);
		return response.data;
	}
	public static async settleSplitInExpense(
		expenseId: string,
		splitId: string,
		headers?: any
	) {
		const res = await http.post<
			ApiRes<ApiResponses.SettleSplitInExpense>,
			ApiRequests.SettleSplitInExpense
		>(
			"/wallet/expense/settle",
			{ expense: expenseId, split: splitId },
			{ headers }
		);
		return res.data;
	}
}
