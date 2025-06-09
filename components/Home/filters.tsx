import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "home-filters");

type HomeFiltersProps = { onClose: () => void };

export const Filters: React.FC<HomeFiltersProps> = ({ onClose }) => {
	return (
		<div className={classes("")}>
			<div className={classes("-header")}>
				<span className={classes("-header-empty")} />
				<Typography>Filters</Typography>
				<button onClick={onClose} className={classes("-close")}>
					<FiX />
				</button>
			</div>
		</div>
	);
};
