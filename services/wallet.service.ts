import { expenseRepo, walletRepo } from "@/repo";
import { ExpenseSpread, ObjectId, WalletDisplayOptions } from "@/types";

export class WalletService {
	public static async getUserExpenses(
		userId: string,
		options: WalletDisplayOptions
	): Promise<Array<ExpenseSpread>> {
		const expenses = await expenseRepo.findWithSplits(
			{ author: new ObjectId(userId) },
			options
		);
		return expenses || [];
	}
	public static async getFilterOptions(userId: string) {
		const filterOptions = walletRepo.getFilterOptions(userId);
		return filterOptions;
	}
}
