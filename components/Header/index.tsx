import React from "react";
import { stylesConfig } from "@/utils";
import styles from "./styles.module.scss";
import { FiSidebar } from "react-icons/fi";
import { useUiStore } from "@/store";

interface IHeaderProps {}

const classes = stylesConfig(styles, "header");

const Header: React.FC<IHeaderProps> = () => {
	const { toggleSidebar } = useUiStore();
	return (
		<div className={classes("")}>
			<button onClick={toggleSidebar} className={classes("-button")}>
				<FiSidebar />
			</button>
			<span className={classes("-divider")} />
		</div>
	);
};

export default Header;
