import { jwtSecret } from "@/config";
import { Logger } from "@/log";
import { authRepo } from "@/repo";
import { AuthResponse, Cookie, IAuthMapping, Tokens, User } from "@/types";
import { genericParse, getNonEmptyString } from "@/utils";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export class AuthService {
	public static async findOrCreateAuthMapping(
		email: string,
		provider: { id: string; name: string },
		userId: string | null,
		misc: any = {}
	): Promise<IAuthMapping> {
		Logger.debug("Finding or creating auth mapping", {
			email,
			provider,
			misc,
		});
		const foundAuthMapping = await authRepo.findOne({
			identifier: email,
			providerName: provider.name,
		});
		Logger.debug("Found auth mapping", foundAuthMapping);
		if (foundAuthMapping) {
			return foundAuthMapping;
		}
		const createdAuthMapping = await authRepo.create({
			identifier: email,
			providerName: provider.name,
			providerId: provider.id,
			misc: JSON.stringify(misc),
			user: userId,
		});
		Logger.debug("Created auth mapping", createdAuthMapping);
		return createdAuthMapping;
	}
	public static async getUserByAuthMappingId(
		authMappingId: string
	): Promise<User | null> {
		const foundAuthMapping = await authRepo.findById(authMappingId);
		Logger.debug(
			"Found auth mapping in getUserByAuthMappingId",
			foundAuthMapping
		);
		if (!foundAuthMapping) return null;
		return foundAuthMapping.user;
	}
	public static async getAuthenticatedUser({
		accessToken,
		refreshToken,
	}: Tokens): Promise<(AuthResponse & Tokens) | null> {
		try {
			const decodedAccessToken: any = jwt.verify(
				accessToken,
				jwtSecret.authAccess
			);
			Logger.debug("Decoded access token", decodedAccessToken);
			const authMappingId = genericParse(
				getNonEmptyString,
				decodedAccessToken.id
			);
			Logger.debug("Auth mapping id", authMappingId);
			const user =
				await AuthService.getUserByAuthMappingId(authMappingId);
			if (!user) return null;
			Logger.debug("Found user", user);
			const tokens: Tokens = { accessToken, refreshToken };
			const cookies = AuthService.getCookies(tokens);
			return {
				user,
				cookies,
				...tokens,
			};
		} catch (error) {
			if (!(error instanceof TokenExpiredError)) {
				return null;
			}
		}
		try {
			const decodedRefreshToken: any = jwt.verify(
				refreshToken,
				jwtSecret.authRefresh
			);
			Logger.debug("Decoded refresh token", decodedRefreshToken);
			const authMappingId = genericParse(
				getNonEmptyString,
				decodedRefreshToken.id
			);
			Logger.debug("Auth mapping id", authMappingId);
			const user =
				await AuthService.getUserByAuthMappingId(authMappingId);
			if (!user) return null;
			Logger.debug("Found user", user);
			const newAccessToken =
				AuthService.generateAccessToken(authMappingId);
			const tokens: Tokens = {
				accessToken: newAccessToken,
				refreshToken,
			};
			const cookies = AuthService.getCookies(tokens);
			return {
				user,
				cookies,
				...tokens,
			};
		} catch {
			return null;
		}
	}
	public static generateRefreshToken(id: string) {
		return jwt.sign({ id }, jwtSecret.authRefresh, {
			expiresIn: "7d",
		});
	}
	public static generateAccessToken(id: string) {
		return jwt.sign({ id }, jwtSecret.authAccess, {
			expiresIn: "1m",
		});
	}
	public static generateTokens(id: string): {
		refreshToken: string;
		accessToken: string;
	} {
		return {
			refreshToken: AuthService.generateRefreshToken(id),
			accessToken: AuthService.generateAccessToken(id),
		};
	}
	public static getCookies({
		accessToken,
		refreshToken,
		logout,
	}: {
		accessToken: string | null;
		refreshToken: string | null;
		logout?: boolean;
	}): Array<Cookie> {
		const cookiesToSet: Array<Cookie> = [];
		if (logout) {
			cookiesToSet.push({
				name: "accessToken",
				value: "",
				maxAge: -1,
			});
			cookiesToSet.push({
				name: "refreshToken",
				value: "",
				maxAge: -1,
			});
			return cookiesToSet;
		}
		if (accessToken) {
			cookiesToSet.push({
				name: "accessToken",
				value: accessToken,
				maxAge: 1 * 60 * 1000,
			});
		}
		if (refreshToken) {
			cookiesToSet.push({
				name: "refreshToken",
				value: refreshToken,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
		}
		return cookiesToSet;
	}
	public static getUpdatedCookies(old: Tokens, newTokens: Tokens) {
		const cookiesToSet = [];
		if (old.accessToken !== newTokens.accessToken) {
			cookiesToSet.push({
				name: "accessToken",
				value: newTokens.accessToken,
				maxAge: 1 * 60 * 1000,
			});
		}
		if (old.refreshToken !== newTokens.refreshToken) {
			cookiesToSet.push({
				name: "refreshToken",
				value: newTokens.refreshToken,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
		}
		return cookiesToSet;
	}
}
