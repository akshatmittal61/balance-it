import { useOnClickOutside } from "@/hooks";
import { stylesConfig } from "@/utils";
import React, { useState } from "react";
import { Typography } from "../Typography";
import { BUTTON_THEMES, BUTTON_VARIANTS } from "./assets";
import styles from "./styles.module.scss";
import { FabButtonProps } from "./types";

const classes = stylesConfig(styles);

const BUTON_SIZES: { [key: string]: string } = {
	small: "fab-btn--size--small",
	medium: "fab-btn--size--medium",
	large: "fab-btn--size--large",
};

const FabButtonComponent: React.ForwardRefRenderFunction<
	HTMLButtonElement,
	FabButtonProps
> = (
	{
		className,
		icon = null,
		label = null,
		size = "medium",
		variant = "filled",
		theme = "default",
		disabled = false,
		onClick,
		options,
		...props
	},
	ref
) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [openOptions, setOpenOptions] = useState(false);
	useOnClickOutside(containerRef, () => {
		setOpenOptions(false);
	});
	if (!icon && !label) return null;
	return (
		<div className={classes("fab-btn--container")} ref={containerRef}>
			{options && options.length > 0 && openOptions ? (
				<>
					{options.map((option) => (
						<button
							key={option.id}
							className={classes("fab-btn-option")}
							onClick={(e) => {
								option.onSelect(option.id);
								setOpenOptions(false);
								if (onClick) onClick(e);
							}}
						>
							{option.icon}
							<Typography
								className={classes("fab-btn-option__label")}
							>
								{option.label}
							</Typography>
						</button>
					))}
				</>
			) : null}
			<button
				className={`${classes(
					"btn",
					"fab-btn",
					BUTON_SIZES[size],
					BUTTON_VARIANTS[variant],
					BUTTON_THEMES[theme],
					{ "btn--disabled": disabled }
				)} ${className}`}
				disabled={disabled}
				onClick={(() => {
					if (options && options.length > 0) {
						return () => setOpenOptions((p) => !p);
					} else return onClick;
				})()}
				ref={ref}
				{...props}
			>
				{icon}
				{label}
			</button>
		</div>
	);
};

export const FabButton = React.forwardRef<HTMLButtonElement, FabButtonProps>(
	FabButtonComponent
);
