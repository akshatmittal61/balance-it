import { routes } from "@/constants";
import { useUiStore } from "@/store";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React from "react";
import { FiHome, FiSidebar } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IHeaderProps {}

const classes = stylesConfig(styles, "header");

export const Header: React.FC<IHeaderProps> = () => {
	const router = useRouter();
	const { toggleSidebar } = useUiStore();
	return (
		<div className={classes("")}>
			<button onClick={toggleSidebar} className={classes("-button")}>
				<FiSidebar />
			</button>
			<span className={classes("-divider")} />
			{router.pathname !== routes.HOME ? (
				<button
					onClick={() => {
						router.push(routes.HOME);
					}}
					className={classes("-button")}
				>
					<FiHome />
				</button>
			) : null}
		</div>
	);
};
