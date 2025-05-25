import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../client";

export * as ApiRequests from "./requests";
export * as ApiResponses from "./responses";

export type ApiRequest<T = any> = Omit<NextApiRequest, "body"> & {
	body: T;
	user?: IUser;
};
export type ApiResponse = NextApiResponse & { locals?: { body?: any } };

export type ApiRes<T> = { message: string; data: T };

export type ApiController = (_: ApiRequest, __: ApiResponse) => Promise<void>;

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
