import { AuthApi, UserApi } from "@/api";
import { Auth as Components, Seo } from "@/components";
import { authRouterInterceptor } from "@/connections";
import { AppSeo, routes } from "@/constants";
import { Typography } from "@/library";
import { Logger } from "@/log";
import { useAuthStore } from "@/store";
import styles from "@/styles/pages/Auth.module.scss";
import { ServerSideResult } from "@/types";
import { Notify, stylesConfig } from "@/utils";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const classes = stylesConfig(styles, "auth");

type T_Auth_Frame = "input" | "otp-verification" | "onboarding";

interface LoginPageProps {
	frame: T_Auth_Frame;
}

const LoginPage: React.FC<LoginPageProps> = (props) => {
	const { user, setUser } = useAuthStore();
	const router = useRouter();
	const [authFrame, setAuthFrame] = useState<T_Auth_Frame>(props.frame);
	const [email, setEmail] = useState("");
	const [requestingOtp, setRequestingOtp] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);
	const [updatingUserDetails, setUpdatingUserDetails] = useState(false);

	const requestOtpWithEmail = async () => {
		try {
			setRequestingOtp(true);
			await AuthApi.requestOtpWithEmail(email);
			setAuthFrame("otp-verification");
		} catch (error: any) {
			Logger.error(error);
			Notify.error(error);
		} finally {
			setRequestingOtp(false);
		}
	};

	const verifyOtp = async (otp: string) => {
		try {
			setVerifyingOtp(true);
			const res = await AuthApi.verifyOtpWithEmail(email, otp);
			setUser(res.data);
			if (res.data.name) {
				const redirectUrl =
					router.query.redirect?.toString() ?? routes.HOME;
				router.push(redirectUrl);
			} else {
				setAuthFrame("onboarding");
			}
		} catch (error: any) {
			Logger.error(error);
			Notify.error(error);
		} finally {
			setVerifyingOtp(false);
		}
	};

	const saveUserDetails = async (data: Components.UserDetails) => {
		try {
			setUpdatingUserDetails(true);
			const res = await UserApi.updateUser(data);
			setUser(res.data);
			router.push(routes.HOME);
		} catch (error: any) {
			Logger.error(error);
			Notify.error(error);
		} finally {
			setUpdatingUserDetails(false);
		}
	};

	useEffect(() => {
		if (user) {
			if (!user.name) {
				setAuthFrame("onboarding");
			}
		}
	}, [user]);

	return (
		<>
			<Seo title={`Login | ${AppSeo.title}`} />
			<main className={classes("")}>
				<span />
				<section>
					<Image
						src="/logo-full.png"
						alt={`${AppSeo.title} logo`}
						height={1920}
						width={1080}
						className={classes("-logo")}
					/>
					{authFrame === "input" ? (
						<>
							<Components.Content
								email={email}
								setEmail={(value) => setEmail(value)}
								onContinueWithEmail={requestOtpWithEmail}
								requestingOtp={requestingOtp}
							/>
							<span className={classes("-divider")}>
								<Typography size="md">OR</Typography>
							</span>
							<Components.GoogleOAuthButton
								onClick={() => {
									router.push("/__/oauth/google");
								}}
							/>
						</>
					) : authFrame === "otp-verification" ? (
						<Components.Verification
							email={email}
							verifyingOtp={verifyingOtp}
							onSubmit={verifyOtp}
							onGoBack={() => {
								setAuthFrame("input");
							}}
						/>
					) : authFrame === "onboarding" ? (
						<Components.Onboarding
							loading={updatingUserDetails}
							onContinue={saveUserDetails}
						/>
					) : null}
				</section>
				<Typography size="sm" className={classes("-footer")} as="p">
					By joining, you agree to the {AppSeo.title} Terms of Service
					and to occasionally receive emails from us. Please read our
					Privacy Policy to learn how we use your personal data.
				</Typography>
			</main>
		</>
	);
};

export default LoginPage;

export const getServerSideProps = (context: GetServerSidePropsContext) => {
	return authRouterInterceptor<ServerSideResult<LoginPageProps>>(context, {
		onLoggedIn() {
			const { redirect } = context.query;
			return {
				redirect: {
					destination: redirect ? redirect.toString() : routes.HOME,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				props: {
					frame: "input" as T_Auth_Frame,
				},
			};
		},
	});
};
