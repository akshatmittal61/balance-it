import { ApiRoute } from "@/server";
import { WalletController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ GET: WalletController.getExpensesSummary },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
