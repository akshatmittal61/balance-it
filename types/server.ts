import { GetServerSidePropsContext } from "next";
import { IUser } from "./client";

type ServerSideProps<T = any> = { props: T };

type ServerSideRedirect = {
	redirect: {
		destination: string;
		permanent: boolean;
	};
};

export type ServerSideResult<T = any> =
	| ServerSideProps<T | { error: string }>
	| ServerSideRedirect;

export type ServerSideAuthInterceptor = <
	T extends ServerSideResult = ServerSideResult,
	V extends ServerSideResult = T,
>(
	_: GetServerSidePropsContext,
	__: {
		onLoggedIn: (_: IUser, __?: any) => T | Promise<T>;
		onLoggedOut: () => V;
	}
) => Promise<T | V>;

export type ServerSideAdminInterceptor = <
	T extends ServerSideResult = ServerSideResult,
	U extends ServerSideResult = T,
	V extends ServerSideResult = U,
>(
	_: GetServerSidePropsContext,
	__: {
		onAdmin: (_: IUser, __?: any) => T | Promise<T>;
		onNonAdmin: (_: IUser, __?: any) => U | Promise<U>;
		onLoggedOut: () => V;
	}
) => Promise<T | U | V>;
