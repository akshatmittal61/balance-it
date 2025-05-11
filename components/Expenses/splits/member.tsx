import { fallbackAssets } from "@/constants";
import { Avatar, CheckBox, Typography } from "@/library";
import React from "react";
import { classes } from "./assets";
import { MembersUserProps } from "./types";

export const MembersUser: React.FC<MembersUserProps> = ({
	name,
	email,
	avatar,
	onSelect,
	isSelected,
	index,
}) => {
	return (
		<div className={classes("-user")}>
			{onSelect ? (
				<CheckBox onClick={onSelect} checked={isSelected} />
			) : (
				<Typography size="s" weight="medium">
					{index + 1}.
				</Typography>
			)}
			<Avatar
				src={avatar || fallbackAssets.avatar}
				alt={name || "User"}
				size={36}
			/>
			<div className={classes("-user__details")}>
				<Typography size="s" weight="medium">
					{name || email.slice(0, 7) + "..."}
				</Typography>
				<Typography size="s">{email}</Typography>
			</div>
		</div>
	);
};
