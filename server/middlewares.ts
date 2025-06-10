import { AuthConstants, HTTP, USER_ROLE } from "@/constants";
import { Logger } from "@/log";
import { AuthService } from "@/services";
import { ApiController, ApiRequest, ApiResponse } from "@/types";
import { genericParse, getNonEmptyString } from "@/utils";
import { ApiFailure, ApiSuccess } from "./payload";

export class ServerMiddleware {
	public static authenticatedRoute(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				Logger.debug("cookies", req.cookies);
				const accessToken = genericParse(
					getNonEmptyString,
					req.cookies[AuthConstants.ACCESS_TOKEN]
				);
				const refreshToken = genericParse(
					getNonEmptyString,
					req.cookies[AuthConstants.REFRESH_TOKEN]
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
					const cookies = AuthService.getCookies({
						accessToken: null,
						refreshToken: null,
						logout: true,
					});
					return new ApiFailure(res)
						.status(HTTP.status.UNAUTHORIZED)
						.message(HTTP.message.UNAUTHORIZED)
						.cookies(cookies)
						.send();
				}
				Logger.debug("Authenticated auth response", authReponse);
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
				Logger.debug("Authenticated user", user);
				return next(req, res);
			} catch (error) {
				Logger.error(error);
				const cookies = AuthService.getCookies({
					accessToken: null,
					refreshToken: null,
					logout: true,
				});
				return new ApiFailure(res)
					.status(HTTP.status.UNAUTHORIZED)
					.message(HTTP.message.UNAUTHORIZED)
					.cookies(cookies)
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
	public static responseBodyPopulator(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				const oldJSON = res.json;
				Logger.debug("Beginning response data interception");
				res.json = (data) => {
					// For Async call, handle the promise and then set the data to `oldJson`
					Logger.debug(
						"Attempting interception for response data",
						data
					);
					if (data && data.then != undefined) {
						Logger.debug("Intercepted Response data", data);
						// Resetting json to original to avoid cyclic call.
						return data
							.then((responseData: any) => {
								// Custom logic/code.
								res.json = oldJSON;
								if (res.locals) {
									res.locals.body = responseData;
								} else {
									res.locals = { body: responseData };
								}
								Logger.debug(
									"Populated Response data",
									responseData
								);
								return oldJSON.call(res, responseData);
							})
							.catch((error: any) => {
								Logger.error(error);
								return oldJSON.call(res, data);
							});
					} else {
						// For non-async interceptor functions
						// Resetting json to original to avoid cyclic call.
						// Custom logic/code.
						Logger.debug("Non-Async Response data", data);
						res.json = oldJSON;
						if (res.locals) {
							res.locals.body = data;
						} else {
							res.locals = { body: data };
						}
						return oldJSON.call(res, data);
					}
				};
				return next(req, res);
			} catch (error) {
				Logger.error(error);
				return next(req, res);
			}
		};
	}
}
