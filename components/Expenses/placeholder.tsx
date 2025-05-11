import { Button, Typography } from "@/library";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import React from "react";
import styles from "./styles.module.scss";

interface IPlaceholderProps {
	title?: React.ReactNode;
	image?: string;
	label?: string;
	action?: () => void;
}

const classes = stylesConfig(styles, "placeholder");

const defaultValues = {
	title: (
		<>
			No expenses yet <br />
			Add one to get this party started
		</>
	),
	image: "/vectors/empty-records.svg",
	label: "Add expense",
};

export const Placeholder: React.FC<IPlaceholderProps> = ({
	title = defaultValues.title,
	image = defaultValues.image,
	label = defaultValues.label,
	action,
}) => {
	return (
		<div className={classes("")}>
			<Image
				src={image}
				alt="empty-placeholder"
				width={1920}
				height={1080}
			/>
			<Typography>{title}</Typography>
			{action ? (
				<Button size="large" onClick={action}>
					{label}
				</Button>
			) : null}
		</div>
	);
};
