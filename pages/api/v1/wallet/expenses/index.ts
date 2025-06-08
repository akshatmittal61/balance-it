import { WalletController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{
		POST: WalletController.getExpensesForUser,
	},
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
