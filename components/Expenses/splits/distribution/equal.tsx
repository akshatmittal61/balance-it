import { Typography } from "@/library";
import React from "react";
import { classes } from "./assets";
import { EqualDistributionProps } from "./types";

export const EqualDistribution: React.FC<EqualDistributionProps> = ({
	member,
}) => {
	return (
		<Typography className={classes("-member-amount")}>
			{member.value}
		</Typography>
	);
};
