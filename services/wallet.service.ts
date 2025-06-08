import { expenseRepo, walletRepo } from "@/repo";
import { ObjectId, WalletDashboardOptions } from "@/types";

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
}
