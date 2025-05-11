import { Error } from "@/components";
import { frontendBaseUrl, routes } from "@/constants";
import { useAuthStore } from "@/store";
import { useRouter } from "next/router";

const ServerError = () => {
	const router = useRouter();
	const { isLoggedIn } = useAuthStore({ syncOnMount: true });
	return (
		<Error
			title="Oops, something went wrong."
			description="Sorry, something went wrong. We're working on getting this fixed as soon as we can."
			image={`${frontendBaseUrl}/vectors/server-error.svg`}
			button={{
				label: "Let's get you home",
				action: () => {
					router.push(isLoggedIn ? routes.HOME : routes.ROOT);
				},
			}}
		/>
	);
};

ServerError.getInitialProps = ({ res, err }: { res: any; err: any }) => {
	const statusCode = res ? res?.statusCode : err ? err?.statusCode : 404;
	return { statusCode };
};

export default ServerError;
