import { fallbackAssets } from "@/constants";
import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";
import { IAvatarProps } from "./types";
import { AvatarUtils } from "./utils";

const classes = stylesConfig(styles);

export const Avatar: React.FC<IAvatarProps> = ({
	src,
	alt,
	fallback = fallbackAssets.avatar,
	shape = "circle",
	className,
	onClick,
	size = "medium",
	isClickable,
	...props
}) => {
	const imageUrl = AvatarUtils.getImageUrl(src);

	return (
		<div
			className={
				classes("avatar", `avatar-shape--${shape}`, {
					"avatar--clickable":
						typeof onClick === "function" || isClickable === true,
				}) + ` ${className ?? ""}`
			}
			onClick={onClick}
			title={alt}
			{...props}
			style={{
				width: AvatarUtils.getAvatarSize(size),
				height: AvatarUtils.getAvatarSize(size),
				...props.style,
			}}
		>
			<img
				src={imageUrl}
				alt={alt + ""}
				width={AvatarUtils.getAvatarSize(size) * 2}
				height={AvatarUtils.getAvatarSize(size) * 2}
				className={classes("avatar-image")}
				onError={(e) => {
					e.currentTarget.src = AvatarUtils.getFallbackAvatarUrl(alt);
				}}
			/>
		</div>
	);
};
