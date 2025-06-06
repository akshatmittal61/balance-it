type T_URL = "frontend" | "backend" | "db";
type T_NODE_ENV = "development" | "production" | "test";

export const url: Record<T_URL, string> = {
	frontend:
		process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "http://localhost:3000",
	backend: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "",
	db: process.env.DB_URI || "mongodb://localhost:27017",
};

export const nodeEnv: T_NODE_ENV =
	process.env.NODE_ENV || process.env.NEXT_PUBLIC_NODE_ENV || "production";

export const service = process.env.NEXT_PUBLIC_SERVICE || "template";

export const enableDebugging: boolean =
	process.env.NEXT_PUBLIC_ENABLE_DEBUGGING === "true" || false;

export const jwtSecret = Object.freeze({
	authRefresh: process.env.JWT_AUTH_REFRESH_SECRET || "",
	authAccess: process.env.JWT_AUTH_ACCESS_SECRET || "",
	oauthValidator: process.env.JWT_OAUTH_VALIDATOR_SECRET || "",
});
