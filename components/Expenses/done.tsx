import { stylesConfig } from "@/utils";
import Image from "next/image";
import React from "react";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "done-animation");

export const DoneAnimation: React.FC = () => {
	return (
		<div className={classes("")}>
			<Image
				src="/animations/check.gif"
				alt="Done"
				width={500}
				height={500}
			/>
		</div>
	);
};
