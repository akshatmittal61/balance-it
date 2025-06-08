import { HTTP } from "@/constants";
import { Logger } from "@/log";
import { ApiSuccess } from "@/server";
import { ExpenseService } from "@/services";
import { WalletService } from "@/services/wallet.service";
import { ApiRequest, ApiRequests, ApiResponse, ApiResponses } from "@/types";
import {
	genericParse,
	getArray,
	getNonEmptyString,
	getSearchParam,
	safeParse,
} from "@/utils";

export class WalletController {
	public static async getExpensesForUser(
		req: ApiRequest<ApiRequests.WalletDashboardOptions>,
		res: ApiResponse
	) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const expenses = await WalletService.getUserExpenses(userId, req.body);
		return new ApiSuccess<ApiResponses.GetUserExpenses>(res).send(expenses);
	}
	public static async getExpenseById(req: ApiRequest, res: ApiResponse) {
		const expenseId = genericParse(
			getNonEmptyString,
			getSearchParam(req.url, "id")
		);
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const expense = await ExpenseService.getExpenseForUser(
			expenseId,
			userId
		);
		return new ApiSuccess<ApiResponses.GetExpenseById>(res).send(expense);
	}
	public static async getExpensesSummary(req: ApiRequest, res: ApiResponse) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const summary = await ExpenseService.getExpensesSummary(userId);
		return new ApiSuccess<ApiResponses.GetExpensesSummary>(res).send(
			summary
		);
	}
	public static async createExpense(
		req: ApiRequest<ApiRequests.CreateExpense>,
		res: ApiResponse
	) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const payload = req.body;
		Logger.debug("Creating expense", payload);
		const splits = safeParse(
			getArray<{ user: string; amount: number }>,
			payload.splits
		);
		const created = await ExpenseService.createExpense(
			payload,
			userId,
			splits || []
		);
		Logger.debug("Created expense", created);
		return new ApiSuccess<ApiResponses.CreateExpense>(res)
			.status(HTTP.status.CREATED)
			.message(HTTP.message.SUCCESS)
			.send(created);
	}
	public static async deleteExpense(req: ApiRequest, res: ApiResponse) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const expenseId = genericParse(
			getNonEmptyString,
			getSearchParam(req.url, "id")
		);
		const data = await ExpenseService.deleteExpense({
			expenseId,
			loggedInUserId: userId,
		});
		return new ApiSuccess<ApiResponses.DeleteExpense>(res).send(data);
	}
	public static async getFilterOptions(req: ApiRequest, res: ApiResponse) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const options = await WalletService.getFilterOptions(userId);
		return new ApiSuccess<ApiResponses.WalletFilterOptions>(res).send(
			options
		);
	}
}
