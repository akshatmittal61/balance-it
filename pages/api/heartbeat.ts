import { DatabaseManager } from "@/connections";
import { apiMethods, dbUri, HTTP } from "@/constants";
import { ServerController } from "@/controllers";
import { ApiRequest, ApiResponse } from "@/types";
import { ApiFailure } from "@/utils";

const handler = async (req: ApiRequest, res: ApiResponse) => {
	const dbContainer = DatabaseManager.createContainer(dbUri);
	await dbContainer.db.connect().catch(() => {});
	if (req.method === apiMethods.GET) {
		return ServerController.heartbeat(dbContainer.db)(req, res);
	} else {
		res.setHeader("Allow", apiMethods.GET);
		return new ApiFailure(res)
			.status(HTTP.status.METHOD_NOT_ALLOWED)
			.message(`Method ${req.method} Not Allowed`)
			.send();
	}
};

export default handler;
