import { apiMethods, dbUri, HTTP } from "@/constants";
import { ApiError, DbConnectionError, ParserSafetyError } from "@/errors";
import { Logger } from "@/log";
import { ServerMiddleware } from "@/server";
import {
	ApiController,
	ApiControllers,
	ApiRequest,
	ApiResponse,
	ApiWrapperOptions,
	DbContainer,
	T_API_METHODS,
} from "@/types";
import { ApiFailure } from "@/utils";
import { NextApiHandler } from "next";
import { DatabaseManager } from "../connections";

export class ApiRoute {
	// Options for API Wrapper
	private useDatabase = false;
	private isAdmin = false;
	private isAuthenticated = false;
	private dbContainer: DbContainer;

	// API Controllers
	GET: ApiController | undefined;
	POST: ApiController | undefined;
	PUT: ApiController | undefined;
	PATCH: ApiController | undefined;
	DELETE: ApiController | undefined;

	// Allowed Methods
	allowedMethods: Array<T_API_METHODS>;

	/**
	 * Initializes a new instance of the ApiRouteHandler class.
	 *
	 * @param {ApiControllers} controllers - An object containing API controllers for different HTTP methods.
	 * @param {ApiWrapperOptions} [options={}] - Options for the API wrapper.
	 * @param {boolean} options.db - Whether to use the database.
	 * @param {boolean} options.auth - Whether to require authentication.
	 * @param {boolean} options.admin - Whether to require admin privileges.
	 */
	constructor(
		{ GET, POST, PUT, PATCH, DELETE }: ApiControllers,
		{ db, auth, admin }: ApiWrapperOptions = {}
	) {
		this.allowedMethods = [];
		this.dbContainer = DatabaseManager.createContainer(dbUri);
		if (db === true) {
			this.useDatabase = true;
		}

		if (auth === true) {
			this.useDatabase = true;
			this.isAuthenticated = true;
		}

		if (admin === true) {
			this.useDatabase = true;
			this.isAdmin = true;
		}

		if (GET) {
			this.GET = GET;
			this.allowedMethods.push(apiMethods.GET);
		}

		if (POST) {
			this.POST = POST;
			this.allowedMethods.push(apiMethods.POST);
		}

		if (PUT) {
			this.PUT = PUT;
			this.allowedMethods.push(apiMethods.PUT);
		}

		if (PATCH) {
			this.PATCH = PATCH;
			this.allowedMethods.push(apiMethods.PATCH);
		}

		if (DELETE) {
			this.DELETE = DELETE;
			this.allowedMethods.push(apiMethods.DELETE);
		}
	}

	/**
	 * Wraps the provided controller with the appropriate middleware based on the authentication status.
	 *
	 * @param {ApiController} controller - The controller to be wrapped with middleware.
	 * @return {ApiController} The wrapped controller with the applied middleware.
	 */
	private wrapper(controller: ApiController): ApiController {
		if (this.isAdmin) {
			return ServerMiddleware.adminRoute(controller);
		} else if (this.isAuthenticated) {
			return ServerMiddleware.authenticatedRoute(controller);
		} else {
			return controller;
		}
	}

	/**
	 * Returns a Next.js API handler function that wraps the provided API controllers with middleware
	 * based on the authentication status and handles database connections.
	 *
	 * @return {NextApiHandler} A Next.js API handler function.
	 */
	public getHandler(): NextApiHandler {
		const handler: NextApiHandler = async (
			req: ApiRequest,
			res: ApiResponse
		) => {
			try {
				if (this.useDatabase) {
					await this.dbContainer.db.connect();
					if (this.dbContainer.db.isConnected() === false) {
						return res
							.status(HTTP.status.SERVICE_UNAVAILABLE)
							.json({ message: "Database not initialized" });
					}
				}

				const { method } = req;
				// We need the handler to run by async/await to catch errors
				if (method === apiMethods.GET && this.GET) {
					return await this.wrapper(this.GET)(req, res);
				} else if (method === apiMethods.POST && this.POST) {
					Logger.debug("About to", req.body, this.POST.name);
					return await this.wrapper(this.POST)(req, res);
				} else if (method === apiMethods.PUT && this.PUT) {
					return await this.wrapper(this.PUT)(req, res);
				} else if (method === apiMethods.PATCH && this.PATCH) {
					return await this.wrapper(this.PATCH)(req, res);
				} else if (method === apiMethods.DELETE && this.DELETE) {
					return await this.wrapper(this.DELETE)(req, res);
				} else {
					res.setHeader("Allow", this.allowedMethods);
					return res
						.status(HTTP.status.METHOD_NOT_ALLOWED)
						.send(`Method ${method} Not Allowed`);
				}
			} catch (error: any) {
				if (error instanceof ApiError) {
					return new ApiFailure(res).send(
						error.message,
						error.status
					);
				} else if (error instanceof DbConnectionError) {
					return new ApiFailure(res).send(
						error.message || "Unable to connect to database",
						HTTP.status.SERVICE_UNAVAILABLE
					);
				} else if (error instanceof ParserSafetyError) {
					return new ApiFailure(res).send(
						error.message || HTTP.message.BAD_REQUEST,
						HTTP.status.BAD_REQUEST
					);
				} else {
					return new ApiFailure(res).send(
						error.message || HTTP.message.INTERNAL_SERVER_ERROR,
						HTTP.status.INTERNAL_SERVER_ERROR
					);
				}
			}
		};

		return handler;
	}
}
