import { Home, Placeholder, Seo } from "@/components";
import { ExpenseTableSkeleton } from "@/components/Expenses/loader";
import { withAuthPage } from "@/connections";
import { AppSeo, routes } from "@/constants";
import {
	useActionBar,
	useAuthStore,
	useGodownStore,
	useWalletStore,
} from "@/store";
import styles from "@/styles/pages/Home.module.scss";
import { ActionBarAtom, IUser } from "@/types";
import { getUserDetails, stylesConfig } from "@/utils";
import React from "react";
import { BsArrowDownUp } from "react-icons/bs";
import { FiFilter, FiPlus } from "react-icons/fi";

type HomePageProps = { user: IUser };

const classes = stylesConfig(styles, "home");

const HomePage: React.FC<HomePageProps> = () => {
	const homePageActionBar: Array<ActionBarAtom> = [
		{
			id: "sort",
			icon: <BsArrowDownUp />,
			drawer: ({ onClose }) => <Home.Sort onClose={onClose} />,
		},
		{
			id: "filter",
			icon: <FiFilter />,
			drawer: ({ onClose }) => <Home.Filters onClose={onClose} />,
		},
		{
			id: "add-expense",
			icon: <FiPlus />,
			href: routes.ADD_EXPENSE,
			styles: {
				backgroundColor: "var(--accent-color-light)",
				color: "var(--accent-color-dark)",
				boxShadow: "inset 12px 0px 8px -2px rgba(0,0,0,0.1)",
			},
		},
	];
	const { user, isLoggedIn } = useAuthStore();
	const { expenses, filterOptions, isLoading } = useWalletStore({
		syncOnMount: true,
	});
	useGodownStore({ syncOnMount: true });
	useActionBar(
		homePageActionBar.filter(({ id }) => {
			if (!isLoggedIn) {
				return false;
			}
			if (id === "filter") {
				return (
					filterOptions.amount.min !== 0 ||
					filterOptions.amount.max !== 0
				);
			}
			return true;
		})
	);
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
