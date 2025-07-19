import { WalletController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{ POST: WalletController.settleSplitInExpense },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
