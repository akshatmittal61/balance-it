import { AuthApi } from "@/api";
import { Cache } from "@/cache";
import { cacheParameter, routes } from "@/constants";
import { IUser, ServerSideAuthInterceptor, ServerSideResult } from "@/types";
import { GetServerSidePropsContext } from "next";

export const authRouterInterceptor: ServerSideAuthInterceptor = async (
	context: GetServerSidePropsContext,
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

export const withAuthPage = <T = any>(
	handler: (_: IUser) => ServerSideResult<T>
) => {
	return async (context: GetServerSidePropsContext) =>
		authRouterInterceptor<ServerSideResult<T>>(context, {
			onLoggedIn: (user) => handler(user),
			onLoggedOut: () => ({
				redirect: { destination: routes.LOGIN, permanent: false },
			}),
		});
};
