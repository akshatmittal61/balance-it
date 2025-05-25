import { http } from "@/connections";
import { ApiRequests, ApiRes, ApiResponses, CreateExpense } from "@/types";

export class WalletApi {
	public static async getUserExpenses(headers?: any) {
		const res = await http.get<ApiRes<ApiResponses.GetUserExpenses>>(
			"/wallet/expenses",
			{ headers }
		);
		return res.data;
	}
	public static async getExpenseForUser(expenseId: string, headers?: any) {
		const res = await http.get<ApiRes<ApiResponses.GetExpenseById>>(
			`/wallet/expenses/${expenseId}`,
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
	public static async createExpense(payload: CreateExpense, headers?: any) {
		const res = await http.post<
			ApiRes<ApiResponses.CreateExpense>,
			ApiRequests.CreateExpense
		>("/wallet/expenses", payload, { headers });
		return res.data;
	}
	public static async deleteExpense(expenseId: string, headers?: any) {
		const response = await http.delete<ApiRes<ApiResponses.DeleteExpense>>(
			`/wallet/expenses/${expenseId}`,
			{ headers }
		);
		return response.data;
	}
}
