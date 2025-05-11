import { Error } from "@/components";
import { frontendBaseUrl, routes } from "@/constants";
import { useAuthStore } from "@/store";
import { useRouter } from "next/router";
import React from "react";

type PageNotFoundProps = {
	title?: string;
	description?: string;
	image?: string;
};

const PageNotFound: React.FC<PageNotFoundProps> = ({
	title = "Oops! You seem to be lost",
	description = "The page you are looking for does not exist.",
	image = `${frontendBaseUrl}/vectors/not-found.svg`,
}) => {
	const router = useRouter();
	const { isLoggedIn } = useAuthStore({ syncOnMount: true });
	return (
		<Error
			title={title}
			description={description}
			image={image}
			button={{
				label: "Let's get you home",
				action: () => {
					router.push(isLoggedIn ? routes.HOME : routes.ROOT);
				},
			}}
		/>
	);
};

export default PageNotFound;
