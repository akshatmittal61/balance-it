import { getEnumeration, stylesConfig } from "@/utils";
import styles from "./styles.module.scss";
import { DistributionMethod } from "./types";

export const classes = stylesConfig(styles, "distribution");

export const distributionMethods = getEnumeration<DistributionMethod>([
	"equal",
	"percentage",
	"fraction",
	"custom",
]);
