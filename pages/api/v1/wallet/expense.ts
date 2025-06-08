import { WalletController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{
		GET: WalletController.getExpenseById,
		POST: WalletController.createExpense,
		DELETE: WalletController.deleteExpense,
	},
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
