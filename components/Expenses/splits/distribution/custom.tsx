import { Input } from "@/library";
import React from "react";
import { classes } from "./assets";
import { CustomDistributionProps } from "./types";

export const CustomDistribution: React.FC<CustomDistributionProps> = ({
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
				onChange(e.target.value);
			}}
		/>
	);
};
