import { HTTP } from "@/constants";
import { Logger } from "@/log";
import { ExpenseService } from "@/services";
import { ApiRequest, ApiRequests, ApiResponse, ApiResponses } from "@/types";
import {
	ApiSuccess,
	genericParse,
	getArray,
	getNonEmptyString,
	safeParse,
} from "@/utils";

export class WalletController {
	public static async getExpensesForUser(req: ApiRequest, res: ApiResponse) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const expenses = await ExpenseService.getUserExpenses(userId);
		return new ApiSuccess<ApiResponses.GetUserExpenses>(res).send(expenses);
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
		return new ApiSuccess<ApiResponses.CreateExpense>(res).send(
			created,
			HTTP.message.SUCCESS,
			HTTP.status.CREATED
		);
	}
	public static async deleteExpense(req: ApiRequest, res: ApiResponse) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const expenseId = genericParse(getNonEmptyString, req.query.id);
		const data = await ExpenseService.deleteExpense({
			expenseId,
			loggedInUserId: userId,
		});
		return new ApiSuccess<ApiResponses.DeleteExpense>(res).send(data);
	}
}
