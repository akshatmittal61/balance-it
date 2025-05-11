import { AddExpenseWizard, Home, Placeholder, Seo } from "@/components";
import { ExpenseTableSkeleton } from "@/components/Expenses/loader";
import { authRouterInterceptor } from "@/connections";
import { AppSeo, routes } from "@/constants";
import { useAuthStore, useGodownStore, useWalletStore } from "@/store";
import styles from "@/styles/pages/Home.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { stylesConfig } from "@/utils";
import React from "react";

type HomePageProps = {
	user: IUser;
};

const classes = stylesConfig(styles, "home");

const HomePage: React.FC<HomePageProps> = () => {
	const { expenses, isLoading } = useWalletStore({
		syncOnMount: true,
	});
	useGodownStore({ syncOnMount: true });
	const { user } = useAuthStore();
	return (
		<>
			<Seo title={`${user?.name} - Home | ${AppSeo.title}`} />
			<main className={classes("")}>
				{isLoading ? (
					<ExpenseTableSkeleton />
				) : expenses.length > 0 ? (
					<Home.Body />
				) : (
					<Placeholder />
				)}
			</main>
			{user ? <AddExpenseWizard /> : null}
		</>
	);
};

export default HomePage;

export const getServerSideProps = (
	context: any
): Promise<ServerSideResult<HomePageProps>> => {
	return authRouterInterceptor(context, {
		onLoggedInAndOnboarded(user) {
			return { props: { user } };
		},
		onLoggedInAndNotOnboarded() {
			return {
				redirect: {
					destination: routes.ONBOARDING + "?redirect=/home",
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination: routes.LOGIN + "?redirect=/home",
					permanent: false,
				},
			};
		},
	});
};
