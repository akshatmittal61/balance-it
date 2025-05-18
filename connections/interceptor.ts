import { AuthApi } from "@/api";
import { Cache } from "@/cache";
import { cacheParameter } from "@/constants";
import { ServerSideAuthInterceptor } from "@/types";

export const authRouterInterceptor: ServerSideAuthInterceptor = async (
	context: any,
	{ onLoggedIn, onLoggedOut }
) => {
	const { req } = context;
	const cookies = req.cookies;
	if (!cookies.accessToken || !cookies.refreshToken) {
		return onLoggedOut();
	}
	try {
		const headers = { cookie: req.headers.cookie };
		const cacheKey = Cache.getKey(cacheParameter.USER, {
			id: cookies.accessToken,
		});
		const { data: user } = await Cache.fetch(cacheKey, () =>
			AuthApi.verify(headers)
		);
		return onLoggedIn(user, headers);
	} catch (error: any) {
		return onLoggedOut();
	}
};
