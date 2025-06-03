import { WalletController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{ GET: WalletController.getFilterOptions },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
