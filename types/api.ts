import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "./client";

export type ApiRequest = NextApiRequest & { user?: IUser };
export type ApiResponse = NextApiResponse & {};

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
