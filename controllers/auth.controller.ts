import { HTTP } from "@/constants";
import { Logger } from "@/log";
import { ApiFailure, ApiSuccess } from "@/server";
import { AuthService, OAuthService, OtpService } from "@/services";
import { ApiRequest, ApiRequests, ApiResponse, ApiResponses } from "@/types";
import { genericParse, getNonEmptyString } from "@/utils";

export class AuthController {
	public static async verifyOAuthSignIn(
		req: ApiRequest<ApiRequests.VerifyGoogleOAuth>,
		res: ApiResponse
	) {
		const code = genericParse(getNonEmptyString, req.body.code);
		const data = await OAuthService.verifyOAuthSignIn(code);
		return new ApiSuccess<ApiResponses.VerifyGoogleOAuth>(res).send(data);
	}
	public static async continueOAuthWithGoogle(
		req: ApiRequest<ApiRequests.ContinueGoogleOAuth>,
		res: ApiResponse
	) {
		const validatorToken = genericParse(getNonEmptyString, req.body.token);
		const { user, cookies } =
			await OAuthService.continueOAuthWithGoogle(validatorToken);
		Logger.debug("User logged in with Google", user, cookies);
		return new ApiSuccess<ApiResponses.ContinueGoogleOAuth>(res)
			.cookies(cookies)
			.send(user);
	}
	public static async requestOtp(
		req: ApiRequest<ApiRequests.RequestOtp>,
		res: ApiResponse
	) {
		const email = getNonEmptyString(req.body.email);
		await OtpService.requestOtpWithEmail(email);
		return new ApiSuccess<ApiResponses.RequestOtp>(res).send(
			null,
			"OTP sent successfully"
		);
	}
	public static async verifyOtp(
		req: ApiRequest<ApiRequests.VerifyOtp>,
		res: ApiResponse
	) {
		const email = getNonEmptyString(req.body.email);
		const otp = genericParse(getNonEmptyString, req.body.otp);
		Logger.debug("Verifying OTP", { email, otp });
		const { cookies, user, isNew } = await OtpService.verifyOtpWithEmail(
			email,
			otp
		);
		const responseStatus = isNew
			? HTTP.status.CREATED
			: HTTP.status.SUCCESS;
		return new ApiSuccess<ApiResponses.VerifyOtp>(res)
			.status(responseStatus)
			.cookies(cookies)
			.data(user);
	}
	public static async verifyLoggedInUser(
		req: ApiRequest<ApiRequests.VerifyUser>,
		res: ApiResponse
	) {
		const user = req.user;
		if (!user) {
			return new ApiFailure(res).send("Please login to continue");
		}
		return new ApiSuccess<ApiResponses.VerifyUser>(res).send(user);
	}
	public static async logout(
		_: ApiRequest<ApiRequests.Logout>,
		res: ApiResponse
	) {
		const cookies = AuthService.getCookies({
			accessToken: null,
			refreshToken: null,
			logout: true,
		});
		return new ApiSuccess<ApiResponses.Logout>(res).cookies(cookies).send();
	}
}
