import { WalletController } from "@/controllers";
import { ApiRoute } from "@/server";

// This API call is not being used currently
// Issue Link: https://stackoverflow.com/questions/79241262/dynamic-routes-not-working-in-nextjs-v15-when-deploy-to-vercel
// Until then: re-route to this endpoint, /api/v1/wallet/expense
const apiRoute = new ApiRoute(
	{
		GET: WalletController.getExpenseById,
		DELETE: WalletController.deleteExpense,
	},
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
