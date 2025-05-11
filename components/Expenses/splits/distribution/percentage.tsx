import { Input } from "@/library";
import React from "react";
import { classes } from "./assets";
import { PercentageDistributionProps } from "./types";

export const PercentageDistribution: React.FC<PercentageDistributionProps> = ({
	member,
	onChange,
}) => {
	return (
		<Input
			name="percentage"
			type="text"
			size="small"
			className={classes("-member-amount")}
			value={member.value}
			onChange={(e: any) => {
				if (!e.target.value.endsWith("%")) {
					e.target.value = e.target.value + "%";
				}
				onChange(e.target.value);
			}}
		/>
	);
};
