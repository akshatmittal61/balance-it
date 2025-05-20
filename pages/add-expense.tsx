import { AddExpensePlaceholder, AddExpenseWizard, Seo } from "@/components";
import { AppSeo } from "@/constants";
import { useAuthStore, useGodownStore, useWalletStore } from "@/store";
import styles from "@/styles/pages/AddExpense.module.scss";
import { getUserDetails, stylesConfig } from "@/utils";
import React from "react";

type AddPageProps = {};

export const classes = stylesConfig(styles, "add-expense");

const AddPage: React.FC<AddPageProps> = () => {
	const { user, isLoggedIn } = useAuthStore();
	useGodownStore({ syncOnMount: true });
	useWalletStore({ syncOnMount: true });
	return (
		<>
			<Seo
				title={`${user ? getUserDetails(user).name : ""} - Add Expense | ${AppSeo.title}`}
			/>
			<main className={classes("")}>
				{isLoggedIn ? <AddExpenseWizard /> : <AddExpensePlaceholder />}
			</main>
		</>
	);
};

export default AddPage;
