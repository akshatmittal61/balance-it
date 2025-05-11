import { HTTP, USER_ROLE } from "@/constants";
import { Logger } from "@/log";
import { AuthService } from "@/services";
import { ApiController, ApiRequest, ApiResponse } from "@/types";
import {
	ApiFailure,
	ApiSuccess,
	genericParse,
	getNonEmptyString,
} from "@/utils";

export class ServerMiddleware {
	public static authenticatedRoute(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				Logger.debug("cookies", req.cookies);
				const accessToken = genericParse(
					getNonEmptyString,
					req.cookies.accessToken
				);
				const refreshToken = genericParse(
					getNonEmptyString,
					req.cookies.refreshToken
				);
				Logger.debug("Authenticating user tokens", {
					accessToken,
					refreshToken,
				});
				const authReponse = await AuthService.getAuthenticatedUser({
					accessToken,
					refreshToken,
				});
				if (!authReponse) {
					return new ApiFailure(res)
						.status(HTTP.status.UNAUTHORIZED)
						.message(HTTP.message.UNAUTHORIZED)
						.send();
				}
				Logger.debug("Authenticated user", authReponse);
				const {
					user,
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				} = authReponse;
				const cookies = AuthService.getUpdatedCookies(
					{ accessToken, refreshToken },
					{
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
					}
				);
				if (cookies.length > 0) {
					new ApiSuccess(res).cookies(cookies);
				}
				req.user = user;
				Logger.info("Authenticated user", user);
				return next(req, res);
			} catch (error) {
				Logger.error(error);
				return new ApiFailure(res)
					.status(HTTP.status.UNAUTHORIZED)
					.message(HTTP.message.UNAUTHORIZED)
					.send();
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
				return new ApiFailure(res)
					.status(HTTP.status.FORBIDDEN)
					.message(HTTP.message.FORBIDDEN)
					.send();
			}
		};
	}
}
