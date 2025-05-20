import styles from "@/styles/pages/AddExpense.module.scss";
import { Seo } from "@/components";
import { AppSeo } from "@/constants";
import { useAuthStore } from "@/store";
import { getUserDetails, stylesConfig } from "@/utils";
import React from "react";

type AddPageProps = {};

const classes = stylesConfig(styles, "add-expense");

const AddPage: React.FC<AddPageProps> = () => {
	const { user } = useAuthStore();
	return (
		<>
			<Seo
				title={`${user ? getUserDetails(user).name : ""} - Add Expense | ${AppSeo.title}`}
			/>
			<main className={classes("")}>Add Expense</main>
		</>
	);
};

export default AddPage;
