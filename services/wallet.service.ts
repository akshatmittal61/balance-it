import { WalletRepo } from "@/repo";

export class WalletService {
	public static async getFilterOptions(userId: string) {
		const filterOptions = WalletRepo.getFilterOptions(userId);
		return filterOptions;
	}
}
