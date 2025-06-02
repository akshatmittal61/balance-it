import { useWalletStore } from "@/store";
import { stylesConfig, WalletUtils } from "@/utils";
import React, { useState } from "react";
import { HomeBucket } from "./bucket";
import styles from "./styles.module.scss";

type BodyProps = {};

const classes = stylesConfig(styles, "home-body");

export const Body: React.FC<BodyProps> = () => {
	const { expenses } = useWalletStore();
	const [expandedExpense, setExpandedExpense] = useState<string | null>(null);
	return (
		<div className={classes("")}>
			{WalletUtils.sortExpensesInMonths(expenses).map((bucket) => (
				<HomeBucket
					key={`home-bucket-${bucket.month}-${bucket.year}`}
					{...bucket}
					opened={expandedExpense}
					onOpen={(id) => {
						if (expandedExpense === id) {
							setExpandedExpense(null);
						} else {
							setExpandedExpense(id);
						}
					}}
				/>
			))}
		</div>
	);
};
