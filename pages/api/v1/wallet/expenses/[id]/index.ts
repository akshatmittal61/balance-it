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

import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		return res.status(200).json(req.query);
	} else {
		return res
			.status(200)
			.json({ message: "Wan'nt GET", query: req.query });
	}
};

export default handler;
