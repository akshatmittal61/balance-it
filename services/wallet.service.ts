import { cacheParameter, HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { expenseRepo, splitRepo, walletRepo } from "@/repo";
import { ISplit, ObjectId, WalletDashboardOptions } from "@/types";
import { ExpenseService } from "./expense.service";
import { Cache } from "@/cache";

export class WalletService {
	public static async getUserExpenses(
		userId: string,
		options: WalletDashboardOptions
	) {
		return await expenseRepo.findWithSplits(
			{ author: new ObjectId(userId) },
			options
		);
	}
	public static async getFilterOptions(userId: string) {
		const filterOptions = walletRepo.getFilterOptions(userId);
		return filterOptions;
	}
	public static async settleSplitInExpense(
		userId: string,
		expenseId: string,
		splitId: string
	): Promise<ISplit> {
		const foundExpense = await ExpenseService.getExpenseForUser(
			expenseId,
			userId
		);
		if (!foundExpense) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Expense not found");
		}
		// TODO: Allow settling custom amount
		const split = await splitRepo.findById(splitId);
		if (!split) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Split not found");
		}
		const settledSplit = await splitRepo.settleOneSplit(
			splitId,
			split.pending
		);
		if (!settledSplit) {
			throw new ApiError(
				HTTP.status.INTERNAL_SERVER_ERROR,
				"Failed to settle split"
			);
		}
		Cache.invalidate(
			Cache.getKey(cacheParameter.EXPENSE, { id: expenseId })
		);
		return settledSplit;
	}
}
