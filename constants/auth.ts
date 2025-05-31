export class AuthConstants {
	static readonly ACCESS_TOKEN = "accessToken";
	static readonly REFRESH_TOKEN = "refreshToken";
	static readonly ACCESS_TOKEN_EXPIRY = 1 * 60;
	static readonly REFRESH_TOKEN_EXPIRY = 24 * 60 * 60;
	static readonly OTP_EXPIRY = 5 * 60 * 1000;
}
