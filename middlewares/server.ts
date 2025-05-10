import { HTTP, USER_ROLE } from "@/constants";
import { Logger } from "@/log";
import { ApiController, ApiRequest, ApiResponse } from "@/types";
import { ApiFailure, genericParse, getNonEmptyString } from "@/utils";

export class ServerMiddleware {
	public static authenticatedRoute(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				// Update with your authentication logic
				const token = genericParse(
					getNonEmptyString,
					req.cookies.token
				);
				if (!token) {
					throw new Error("No token provided");
				}
				return next(req, res);
			} catch (error) {
				Logger.error(error);
				return new ApiFailure(res).send(
					HTTP.message.UNAUTHORIZED,
					HTTP.status.UNAUTHORIZED
				);
			}
		};
	}
	public static adminRoute(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				// Update with your authentication logic
				// Check if the user is an admin
				const role = genericParse(getNonEmptyString, req.cookies.role);
				if (role !== USER_ROLE.ADMIN) {
					throw new Error("Not an admin");
				}
				return next(req, res);
			} catch (error) {
				Logger.error(error);
				return new ApiFailure(res).send(
					HTTP.message.FORBIDDEN,
					HTTP.status.FORBIDDEN
				);
			}
		};
	}
}
