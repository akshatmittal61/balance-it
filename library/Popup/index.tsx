import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { FiEdit2, FiTrash, FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { PopupProps } from "./types";

const classes = stylesConfig(styles, "modal-popup");

export const Popup: React.FC<PopupProps> = ({
	children,
	title,
	onClose,
	onEdit,
	onDelete,
	footer,
	primaryAction,
	secondaryAction,
	showHeader = true,
	showFooter = true,
	width = "60%",
	height = "60%",
	style,
	styles,
	loading = false,
	className,
	...props
}) => {
	const [isClosing, setIsClosing] = useState(false);
	const popupRef = useRef<HTMLDivElement>(null);

	const startClosing = () => {
		if (!loading) setIsClosing(true);
	};

	const closePane = () => {
		if (isClosing) {
			if (onClose) {
				onClose();
			}
			setIsClosing(false);
		}
	};

	useEffect(() => {
		popupRef.current?.focus();
	}, []);

	return (
		<>
			<div
				className={
					classes("", {
						"--closing": isClosing,
					}) + ` ${className}`
				}
				role="dialog"
				aria-modal="true"
				aria-label={title}
				aria-busy={loading}
				aria-hidden={isClosing}
				onAnimationEnd={closePane}
				style={{
					width: `min(95vw, ${width})`,
					height: `min(95vh, ${height})`,
					justifyContent: showFooter ? "space-between" : "flex-start",
					...style,
				}}
				ref={popupRef}
				tabIndex={-1}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						startClosing();
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
								onClick={startClosing}
							>
								<FiX />
							</button>
						</div>
					</div>
				) : null}
				{children ? (
					<div className={classes("-body")}>{children}</div>
				) : null}
				{showFooter && (primaryAction || secondaryAction || footer) ? (
					<div
						className={classes("-footer")}
						style={{
							justifyContent:
								footer && (primaryAction || secondaryAction)
									? "space-between"
									: footer
										? "flex-start"
										: primaryAction || secondaryAction
											? "flex-end"
											: "flex-start",
							...styles?.footer,
						}}
					>
						{footer && (primaryAction || secondaryAction) ? (
							<>
								<div className={classes("-footer-left")}>
									{footer}
								</div>
								<div className={classes("-footer-right")}>
									{secondaryAction}
									{primaryAction}
								</div>
							</>
						) : (
							<>
								{footer ? footer : null}
								{secondaryAction ? secondaryAction : null}
								{primaryAction ? primaryAction : null}
							</>
						)}
					</div>
				) : null}
			</div>
			<div className={classes("-overlay")} onClick={startClosing}></div>
		</>
	);
};
