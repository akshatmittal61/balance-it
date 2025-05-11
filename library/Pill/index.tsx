import { useOnClickOutside } from "@/hooks";
import { Typography } from "@/library";
import { stylesConfig } from "@/utils/functions";
import React, { useRef, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { PillProps } from "./types";

const classes = stylesConfig(styles, "pill");

export const Pill: React.FC<PillProps> = ({
	size = "medium",
	variant = "filled",
	updatable = false,
	icon = null,
	dot = true,
	theme = "info",
	loading = false,
	label,
	options,
	onSelect,
	onRemove,
}) => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(dropdownRef, () => {
		setOpenDropdown(false);
	});
	return (
		<div
			className={classes(
				"",
				`__theme--${theme}`,
				`__size--${size}`,
				`__variant--${variant}`
			)}
			onClick={() => {
				if (updatable && options && options.length > 0) {
					setOpenDropdown((p) => !p);
				}
			}}
		>
			{icon ? (
				icon
			) : dot ? (
				<svg
					className={classes("-dot", {
						"-dot--loading": loading,
					})}
					width="8"
					height="8"
					viewBox="0 0 8 8"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="4"
						cy="4"
						r="4"
						fill={dot ? "currentColor" : "none"}
					/>
				</svg>
			) : null}
			<Typography
				size={size === "small" ? "xs" : size === "large" ? "md" : "sm"}
				className={classes("-label")}
			>
				{label}
			</Typography>
			{onRemove ? (
				<FiX onClick={onRemove} />
			) : updatable && options && options.length > 0 ? (
				<FiChevronDown />
			) : null}
			{openDropdown ? (
				<div className={classes("--dropdown")} ref={dropdownRef}>
					{options?.map((option) => (
						<Typography
							size="sm"
							key={`pill-option-${option.value}`}
							className={classes("--dropdown__item")}
							onClick={() => onSelect?.(option.value)}
						>
							{option.label}
						</Typography>
					))}
				</div>
			) : null}
		</div>
	);
};
