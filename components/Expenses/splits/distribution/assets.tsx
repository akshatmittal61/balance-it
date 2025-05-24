import { stylesConfig } from "@/utils";
import React from "react";
import {
	FiColumns,
	FiDivide,
	FiPercent,
	FiPieChart,
	FiType,
} from "react-icons/fi";
import styles from "./styles.module.scss";
import { DistributionMethod } from "./types";

export const classes = stylesConfig(styles, "distribution");

export const distributionMethods: Record<
	DistributionMethod,
	{ id: DistributionMethod; label: string; icon: React.ReactNode }
> = {
	equal: {
		id: "equal",
		label: "Equal",
		icon: <FiColumns />,
	},
	percentage: {
		id: "percentage",
		label: "Percentage",
		icon: <FiPercent />,
	},
	shares: {
		id: "shares",
		label: "Shares",
		icon: <FiPieChart />,
	},
	fraction: {
		id: "fraction",
		label: "Fraction",
		icon: <FiDivide />,
	},
	custom: {
		id: "custom",
		label: "Manual",
		icon: <FiType />,
	},
};
