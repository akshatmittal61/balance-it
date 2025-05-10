import { NextApiRequest, NextApiResponse } from "next";

export type ApiRequest = NextApiRequest & {};
export type ApiResponse = NextApiResponse & {};
export type Cookie = {
	name: string;
	value: string;
	maxAge: number;
};

export type ApiRes<T> = { message: string; data: T };

export type ApiController = (_: ApiRequest, __: ApiResponse) => any;

export type ApiControllers = {
	GET?: ApiController;
	POST?: ApiController;
	PUT?: ApiController;
	PATCH?: ApiController;
	DELETE?: ApiController;
};

export type ApiWrapperOptions = {
	db?: boolean;
	auth?: boolean;
	admin?: boolean;
};

export type T_API_METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
