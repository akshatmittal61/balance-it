import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		res.status(200).json(req.query);
	} else {
		res.status(200).json({ message: "Wasn't GET", query: req.query });
	}
};

export default handler;
