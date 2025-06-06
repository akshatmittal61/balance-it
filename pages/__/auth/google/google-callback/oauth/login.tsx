import { AuthApi } from "@/api";
import { routes } from "@/constants";
import { Logger } from "@/log";
import { useAuthStore } from "@/store";
import styles from "@/styles/pages/Auth.module.scss";
import { genericParse, getNonEmptyString, Notify, stylesConfig } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const classes = stylesConfig(styles, "oauth");

type GoogleOAuthRedirectedPageProps = React.FC<{ token: string }>;

const GoogleOAuthRedirectedPage: GoogleOAuthRedirectedPageProps = (props) => {
	const router = useRouter();
	const { setUser } = useAuthStore();
	const continueWithGoogle = async () => {
		try {
			const res = await AuthApi.continueOAuthWithGoogle(props.token);
			setUser(res.data);
			router.push(routes.HOME);
		} catch {
			Notify.error("Something went wrong, please try again");
			router.push(routes.LOGIN);
		}
	};
	useEffect(() => {
		continueWithGoogle();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
			<Image
				src="/favicon.svg"
				alt="logo"
				width={400}
				height={400}
				className={classes("-loader")}
			/>
		</main>
	);
};

export default GoogleOAuthRedirectedPage;

export const getServerSideProps = async (context: any) => {
	const { query } = context;
	try {
		const code = genericParse(getNonEmptyString, query.code);
		Logger.debug("code", code);
		const verificationRes = await AuthApi.verifyOAuthSignIn(code);
		Logger.debug("verificationRes", verificationRes);
		return { props: { token: verificationRes.data } };
	} catch (error) {
		Logger.error(error);
		return {
			redirect: {
				destination: routes.ROOT,
				permanent: false,
			},
		};
	}
};
