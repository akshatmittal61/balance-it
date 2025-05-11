import { Input } from "@/library";
import { Logger } from "@/log";
import { isValidFraction, safeValidation } from "@/validations";
import React, { useEffect, useState } from "react";
import { classes } from "./assets";
import { FractionDistributionProps } from "./types";

export const FractionDistribution: React.FC<FractionDistributionProps> = ({
	member,
	onChange,
}) => {
	const [isValid, setIsValid] = useState<boolean>(false);
	const [value, setValue] = useState(member.value.toString().split("/"));
	const handleChange = (
		updatedValue: string,
		part: "numerator" | "denominator"
	) => {
		let newValue = [];
		if (part === "numerator") {
			newValue = [updatedValue, value[1]];
		} else {
			newValue = [value[0], updatedValue];
		}
		const newFraction = newValue.join("/");
		const newValidation = safeValidation(isValidFraction, newFraction);
		Logger.debug("newValue", newValue);
		Logger.debug("newFraction", newFraction);
		Logger.debug("newValidation", newValidation);
		setIsValid(newValidation);
		setValue(newValue);
		onChange(newFraction);
	};
	useEffect(() => {
		setValue(member.value.toString().split("/"));
	}, [member.value]);

	return (
		<div className={classes("-member-fraction")}>
			<Input
				name="fraction"
				type="text"
				size="small"
				className={classes(
					"-member-amount",
					"-member-amount--fraction"
				)}
				value={value[0]}
				error={!isValid}
				onChange={(e: any) => {
					handleChange(e.target.value, "numerator");
				}}
			/>
			{" / "}
			<Input
				name="fraction"
				type="text"
				size="small"
				className={classes(
					"-member-amount",
					"-member-amount--fraction"
				)}
				value={value[1]}
				error={!isValid}
				onChange={(e: any) => {
					handleChange(e.target.value, "denominator");
				}}
			/>
		</div>
	);
};
