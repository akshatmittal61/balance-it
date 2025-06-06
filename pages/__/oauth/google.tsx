import { Auth } from "@/components";
import { oauth_google } from "@/config";
import { GetServerSideProps } from "next";
import React from "react";

type OAuthRedirectParams = {
	client_id: string;
	redirect_uri: string;
	response_type: string;
	scope: string;
	redirect?: string;
};

const GoogleOAuthRedirectPage: React.FC = () => {
	return (
		<main
			style={{
				width: "100vw",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Auth.GoogleOAuthButton
				onClick={() => {
					const query = {
						client_id: oauth_google.client_id,
						redirect_uri: oauth_google.redirect_uri,
						response_type: "code",
						scope: oauth_google.scopes,
					};
					const url = new URL(oauth_google.endpoint);
					url.search = new URLSearchParams(query).toString();
					window.location.href = url.toString();
				}}
			/>
		</main>
	);
};

export default GoogleOAuthRedirectPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const query: OAuthRedirectParams = {
		client_id: oauth_google.client_id,
		redirect_uri: oauth_google.redirect_uri,
		response_type: "code",
		scope: oauth_google.scopes,
	};
	// get redirect from search params if available
	if (context.query.redirect) {
		query.redirect = context.query.redirect as string;
		context.res.setHeader(
			"Set-Cookie",
			`redirect=${context.query.redirect}; Path=/; HttpOnly; SameSite=Lax`
		);
	}
	const url = new URL(oauth_google.endpoint);
	url.search = new URLSearchParams(query).toString();
	const complete_url = url.toString();
	return {
		redirect: {
			destination: complete_url,
			permanent: false,
		},
	};
};
