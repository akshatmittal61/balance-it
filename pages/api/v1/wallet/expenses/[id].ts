import { ApiRoute } from "@/server";
import { WalletController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ DELETE: WalletController.deleteExpense },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
