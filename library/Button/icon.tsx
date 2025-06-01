import { stylesConfig } from "@/utils";
import React, { forwardRef } from "react";
import styles from "./styles.module.scss";
import { IconButtonProps } from "./types";

const classNames = stylesConfig(styles);

const BUTON_SIZES: { [key: string]: string } = {
	small: "icon-btn--size--small",
	medium: "icon-btn--size--medium",
	large: "icon-btn--size--large",
};

const IconButtonComponent: React.ForwardRefRenderFunction<
	HTMLButtonElement,
	IconButtonProps
> = ({ className, size = "medium", icon, ...props }, ref) => {
	return (
		<button
			className={`${classNames("icon-btn", BUTON_SIZES[size])} ${className}`}
			disabled={props.disabled}
			ref={ref}
			{...props}
		>
			{icon}
		</button>
	);
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	IconButtonComponent
);
