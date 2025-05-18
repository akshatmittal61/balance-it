import { http } from "@/connections";
import { ApiRequests, ApiRes, ApiResponses } from "@/types";

export class AuthApi {
	public static async verify(headers?: any) {
		const res = await http.get<ApiRes<ApiResponses.VerifyUser>>(
			"/auth/verify",
			{ headers }
		);
		return res.data;
	}
	public static async logout(headers?: any) {
		const response = await http.get<ApiRes<ApiResponses.Logout>>(
			"/auth/logout",
			{
				headers,
			}
		);
		return response.data;
	}
	public static async requestOtpWithEmail(email: string) {
		const response = await http.post<
			ApiRes<ApiResponses.RequestOtp>,
			ApiRequests.RequestOtp
		>("/auth/otp/request", { email });
		return response.data;
	}
	public static async verifyOtpWithEmail(email: string, otp: string) {
		const response = await http.post<
			ApiRes<ApiResponses.VerifyOtp>,
			ApiRequests.VerifyOtp
		>("/auth/otp/verify", { email, otp });
		return response.data;
	}

	/**
	 * Verifies the authentication sign-in process using the code received from the OAuth provider.
	 *
	 * @param {string} code - The authentication code to verify.
	 * @return {Promise<ApiRes<string>>} - A Promise that resolves to the email of the authenticated user.
	 */
	public static async verifyOAuthSignIn(code: string) {
		const res = await http.post<
			ApiRes<ApiResponses.VerifyGoogleOAuth>,
			ApiRequests.VerifyGoogleOAuth
		>("/oauth/google/verify", { code });
		return res.data;
	}

	/**
	 * Continues the authentication sign-in process using the email of the authenticated user.
	 *
	 * @param {string} token - The email of the authenticated user.
	 * @return {Promise<ApiRes<IUser>>} - A Promise that resolves to the authenticated user.
	 */
	public static async continueOAuthWithGoogle(token: string) {
		const res = await http.post<
			ApiRes<ApiResponses.ContinueGoogleOAuth>,
			ApiRequests.ContinueGoogleOAuth
		>("/oauth/google/continue", { token });
		return res.data;
	}
}
