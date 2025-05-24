import { ApiRoute } from "@/server";
import { WalletController } from "@/controllers";

const apiRoute = new ApiRoute(
	{
		GET: WalletController.getExpensesForUser,
		POST: WalletController.createExpense,
	},
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
