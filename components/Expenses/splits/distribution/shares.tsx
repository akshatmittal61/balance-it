import { Typography } from "@/library";
import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { classes } from "./assets";
import { SharesDistributionProps } from "./types";

export const ShareDistribution: React.FC<SharesDistributionProps> = ({
	member,
	onChange,
}) => {
	return (
		<div className={classes("-member-share")}>
			<button
				className={classes("-member-share__icon")}
				onClick={() => {
					const val = +member.value;
					if (val > 0) {
						onChange(val - 1);
					} else {
						onChange(0);
					}
				}}
			>
				<FiMinus />
			</button>
			<Typography className={classes("-member-share__value")}>
				{member.value}
			</Typography>
			<button
				className={classes("-member-share__icon")}
				onClick={() => {
					const val = +member.value;
					onChange(val + 1);
				}}
			>
				<FiPlus />
			</button>
		</div>
	);
};
