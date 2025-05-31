import { Home, Placeholder, Seo } from "@/components";
import { ExpenseTableSkeleton } from "@/components/Expenses/loader";
import { authRouterInterceptor } from "@/connections";
import { AppSeo, routes } from "@/constants";
import { useAuthStore, useGodownStore, useWalletStore } from "@/store";
import styles from "@/styles/pages/Home.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { getUserDetails, stylesConfig } from "@/utils";
import React from "react";

type HomePageProps = { user: IUser };

const classes = stylesConfig(styles, "home");

const HomePage: React.FC<HomePageProps> = () => {
	const { user, isLoggedIn } = useAuthStore();
	const { expenses, isLoading } = useWalletStore({ syncOnMount: true });
	useGodownStore({ syncOnMount: true });
	return (
		<>
			<Seo
				title={`${user ? getUserDetails(user).name : ""} - Home | ${AppSeo.title}`}
			/>
			<main className={classes("")}>
				{expenses.length > 0 ? (
					<Home.Body />
				) : isLoading || !isLoggedIn ? (
					<ExpenseTableSkeleton />
				) : (
					<Placeholder />
				)}
			</main>
		</>
	);
};

export default HomePage;

export const getServerSideProps = (
	context: any
): Promise<ServerSideResult<HomePageProps>> => {
	return authRouterInterceptor(context, {
		onLoggedIn(user) {
			return {
				props: { user },
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination: routes.LOGIN,
					permanent: false,
				},
			};
		},
	});
};
