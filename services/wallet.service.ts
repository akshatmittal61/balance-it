import { walletRepo } from "@/repo";

export class WalletService {
	public static async getFilterOptions(userId: string) {
		const filterOptions = walletRepo.getFilterOptions(userId);
		return filterOptions;
	}
}
