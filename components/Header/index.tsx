import { useUiStore } from "@/store";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React from "react";
import { FiSidebar } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IHeaderProps {}

const classes = stylesConfig(styles, "header");

export const Header: React.FC<IHeaderProps> = () => {
	const router = useRouter();
	const { toggleSidebar, headerNavigation, headerContent } = useUiStore();
	return (
		<div className={classes("")}>
			<button onClick={toggleSidebar} className={classes("-button")}>
				<FiSidebar />
			</button>
			{headerNavigation.length > 0 ? (
				<span className={classes("-divider")} />
			) : null}
			{headerNavigation.length > 0 ? (
				<nav className={classes("-navigation")}>
					{headerNavigation.map((item) => (
						<button
							key={`header-navigation-${item.route}`}
							onClick={() => {
								router.push(item.route);
							}}
							className={classes("-button")}
						>
							{item.icon}
						</button>
					))}
				</nav>
			) : null}
			{headerContent ? (
				<div className={classes("-content")}>{headerContent}</div>
			) : null}
		</div>
	);
};
