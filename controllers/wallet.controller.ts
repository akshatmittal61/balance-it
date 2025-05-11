import { HTTP } from "@/constants";
import { Logger } from "@/log";
import { ExpenseService } from "@/services";
import { ApiRequest, ApiResponse, ExpenseSpread } from "@/types";
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
		return new ApiSuccess<Array<ExpenseSpread>>(res).send(expenses);
	}
	public static async getExpensesSummary(req: ApiRequest, res: ApiResponse) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const summary = await ExpenseService.getExpensesSummary(userId);
		return new ApiSuccess(res).send(summary);
	}
	public static async createExpense(req: ApiRequest, res: ApiResponse) {
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
		return new ApiSuccess<ExpenseSpread>(res).send(
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
		return new ApiSuccess<boolean>(res).send(data);
	}
}
