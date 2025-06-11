import { useUiStore } from "@/store";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "action-bar");

type ActionBarProps = {};

export const ActionBar: React.FC<ActionBarProps> = () => {
	const { actionBar } = useUiStore();
	const router = useRouter();
	const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
	const handleCloseDrawer = () => {
		setActiveDrawerId(null);
	};

	if (actionBar.length === 0) {
		return null; // Return null if there are no action bar items
	}
	return (
		<>
			{activeDrawerId ? (
				<div
					className={classes("-drawer-overlay")}
					onClick={handleCloseDrawer}
				/>
			) : null}
			{activeDrawerId ? (
				<div className={classes("-drawer")}>
					{(() => {
						const atom = actionBar.find(
							(atom) => atom.id === activeDrawerId
						);
						if (!atom || !("drawer" in atom)) return null;
						const Drawer = atom.drawer;
						return <Drawer onClose={handleCloseDrawer} />;
					})()}
				</div>
			) : null}
			<div className={classes("")}>
				{actionBar.map((atom) => (
					<button
						className={classes("-button")}
						key={`${atom.id}-icon`}
						style={atom.styles}
						onClick={() => {
							if ("onClick" in atom) {
								atom.onClick();
							} else if ("href" in atom) {
								router.push(atom.href);
							} else if ("drawer" in atom) {
								if (activeDrawerId === atom.id) {
									setActiveDrawerId(null);
								} else {
									setActiveDrawerId(atom.id);
								}
							}
						}}
					>
						{atom.icon}
					</button>
				))}
			</div>
		</>
	);
};
