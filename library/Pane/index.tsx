import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { FiEdit2, FiTrash, FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { PaneProps } from "./types";

const classes = stylesConfig(styles, "modal-pane");

export const Pane: React.FC<PaneProps> = ({
	children,
	title,
	onClose,
	onEdit,
	onDelete,
	primaryAction,
	secondaryAction,
	showHeader = true,
	width = "60%",
	height = "80vh",
	style,
	styles,
	loading = false,
	direction = "left",
	className,
	...props
}) => {
	const [isClosing, setIsClosing] = useState(false);
	const paneRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			if (!loading) onClose && onClose();
		}, 300);
	};

	useEffect(() => {
		paneRef.current?.focus();
	}, []);

	return (
		<>
			<div
				className={
					classes("", {
						"--closing": isClosing,
					}) + ` ${className}`
				}
				style={{
					width:
						direction === "left" || direction === "right"
							? `min(95vw, ${width})`
							: "100%",
					height:
						direction === "left" || direction === "right"
							? "100vh"
							: `min(95vh, ${height})`,
					...style,
				}}
				data-direction={direction}
				ref={paneRef}
				tabIndex={-1}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						handleClose();
					}
				}}
				{...props}
			>
				{showHeader ? (
					<div className={classes("-header")} style={styles?.header}>
						<Typography size="xl" weight="medium">
							{title}
						</Typography>
						<div className={classes("-header-actions")}>
							{secondaryAction ? secondaryAction : null}
							{primaryAction ? primaryAction : null}
							{onEdit ? (
								<button
									className={classes("-header-edit")}
									onClick={onEdit}
								>
									<FiEdit2 />
								</button>
							) : null}
							{onDelete ? (
								<button
									className={classes("-header-delete")}
									onClick={onDelete}
								>
									<FiTrash />
								</button>
							) : null}
							<button
								className={classes("-header-close")}
								onClick={handleClose}
							>
								<FiX />
							</button>
						</div>
					</div>
				) : null}
				{children ? (
					<div className={classes("-body")}>{children}</div>
				) : null}
			</div>
			<div className={classes("-overlay")} onClick={handleClose}></div>
		</>
	);
};
