import { Home, Placeholder, Seo } from "@/components";
import { ExpenseTableSkeleton } from "@/components/Expenses/loader";
import { withAuthPage } from "@/connections";
import { AppSeo } from "@/constants";
import { useAuthStore, useGodownStore, useWalletStore } from "@/store";
import styles from "@/styles/pages/Home.module.scss";
import { IUser } from "@/types";
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

export const getServerSideProps = withAuthPage<HomePageProps>((user) => ({
	props: { user },
}));
