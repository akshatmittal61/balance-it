import { Typography } from "@/library";
import { ExpensesSummary } from "@/types";
import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

type ExpensesSummaryWidgetProps = {
	summary: ExpensesSummary;
};

const classes = stylesConfig(styles, "expenses-summary");

export const ExpensesSummaryWidget: React.FC<ExpensesSummaryWidgetProps> = ({
	summary,
}) => {
	return (
		<div className={classes("")}>
			<Typography
				as="h2"
				size="lg"
				weight="medium"
				className={classes("-heading")}
			>
				Summary
			</Typography>
			<div className={classes("-row")}>
				<Typography size="s" className={classes("-key")}>
					Paid
				</Typography>
				<Typography
					size="lg"
					className={classes("-value", "-value--paid")}
				>
					{summary.paid}
				</Typography>
			</div>
			<div className={classes("-row")}>
				<Typography size="s" className={classes("-key")}>
					Received
				</Typography>
				<Typography
					size="lg"
					className={classes("-value", "-value--received")}
				>
					{summary.received}
				</Typography>
			</div>
			<hr className={classes("-divider")} />
			<div className={classes("-row")}>
				<Typography size="s" className={classes("-key")}>
					Total
				</Typography>
				<Typography
					size="lg"
					className={classes("-value", {
						"-value--received": summary.received > summary.paid,
						"-value--paid": summary.received < summary.paid,
					})}
				>
					{Math.abs(summary.received - summary.paid)}
				</Typography>
			</div>
		</div>
	);
};
