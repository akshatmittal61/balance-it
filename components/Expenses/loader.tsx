import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

type ExpenseTableSkeletonProps = {};

const classes = stylesConfig(styles, "expense-skeleton");

export const ExpenseTableSkeleton: React.FC<ExpenseTableSkeletonProps> = () => {
	return (
		<div className={classes("")}>
			<div className={classes("-skeleton")}></div>
			<div className={classes("-skeleton")}></div>
			<div className={classes("-skeleton")}></div>
			<div className={classes("-skeleton")}></div>
			<div className={classes("-skeleton")}></div>
		</div>
	);
};
