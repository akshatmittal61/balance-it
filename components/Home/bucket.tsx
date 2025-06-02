import { expenseTypes } from "@/constants";
import { Typography } from "@/library";
import { ExpensesBucket } from "@/types";
import { stylesConfig } from "@/utils";
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { ExpenseRow } from "../Expenses";
import styles from "./styles.module.scss";
import { Responsive } from "@/layouts";

const classes = stylesConfig(styles, "home-body-bucket");

type HomeBucketProps = ExpensesBucket & {
	opened: string | null;
	onOpen: (_: string) => void;
};

export const HomeBucket: React.FC<HomeBucketProps> = ({
	month,
	year,
	expenses,
	total,
	type,
	opened,
	onOpen,
}) => {
	const [isExpanded, setIsExpanded] = useState(true);
	return (
		<div className={classes("")}>
			<div
				className={classes("__header")}
				onClick={() => setIsExpanded((p) => !p)}
			>
				<div className={classes("__meta")}>
					<Typography
						size="lg"
						weight="medium"
						className={classes("__title")}
					>
						{month} {year}
					</Typography>
					<Typography
						size="sm"
						weight="medium"
						className={classes("__summary", {
							"__summary--paid": type === expenseTypes.PAID.id,
							"__summary--received":
								type === expenseTypes.RECEIVED.id,
						})}
					>
						{Intl.NumberFormat("en-IN", {
							style: "currency",
							currency: "INR",
						}).format(Math.abs(total))}
					</Typography>
				</div>
				<span className={classes("__icon")}>
					<FiChevronDown
						style={{
							transform: isExpanded
								? "rotate(180deg)"
								: "rotate(0deg)",
						}}
					/>
				</span>
			</div>
			<Responsive.Row
				className={classes("__content", {
					"__content--expanded": isExpanded,
					"__content--collapsed": !isExpanded,
				})}
			>
				{expenses.map((expense) => (
					<Responsive.Col
						xlg={50}
						lg={50}
						md={50}
						sm={100}
						xsm={100}
						key={`group-expense-${expense.id}`}
					>
						<ExpenseRow
							expense={expense}
							expanded={opened === expense.id}
							onExpand={() => {
								onOpen(expense.id);
							}}
						/>
					</Responsive.Col>
				))}
			</Responsive.Row>
		</div>
	);
};
