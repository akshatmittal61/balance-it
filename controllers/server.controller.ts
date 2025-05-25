import { DatabaseManager } from "@/connections";
import { HTTP } from "@/constants";
import { ApiFailure, ApiSuccess } from "@/server";
import { ApiRequest, ApiResponse } from "@/types";

export class ServerController {
	public static health =
		(db: DatabaseManager) => (_: ApiRequest, res: ApiResponse) => {
			if (db.isConnected() === false) {
				return new ApiFailure(res)
					.status(HTTP.status.SERVICE_UNAVAILABLE)
					.message(HTTP.message.DB_CONNECTION_ERROR)
					.send();
			}
			const payload = {
				identity: process.pid,
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
				database: db.isConnected(),
			};
			return new ApiSuccess<typeof payload>(res)
				.message(HTTP.message.HEALTHY_API)
				.send(payload);
		};
	public static heartbeat =
		(db: DatabaseManager) => (_: ApiRequest, res: ApiResponse) => {
			const payload = {
				identity: process.pid,
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
				database: db.isConnected(),
			};
			return new ApiSuccess<typeof payload>(res)
				.message(HTTP.message.HEARTBEAT)
				.send(payload);
		};
}
