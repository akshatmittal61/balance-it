/* import { WalletController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{
		GET: WalletController.getExpenseById,
		DELETE: WalletController.deleteExpense,
	},
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
 */

import { ApiRequest, ApiResponse } from "@/types";
import { ApiSuccess } from "@/utils";

const handler = (req: ApiRequest, res: ApiResponse) => {
	if (req.method === "GET") {
		return new ApiSuccess(res).json(req.query).send();
	} else {
		return new ApiSuccess(res)
			.json({ message: "Wan'nt GET", query: req.query })
			.send();
	}
};

export default handler;
