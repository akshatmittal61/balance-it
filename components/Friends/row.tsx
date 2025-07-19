import { Avatar, Typography } from "@/library";
import { Friend } from "@/types";
import { getUserDetails, stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

type FriendRowProps = {
	friend: Friend;
};

const classes = stylesConfig(styles, "friend-row");

export const FriendRow: React.FC<FriendRowProps> = ({ friend }) => {
	return (
		<div className={classes("")}>
			<Avatar
				src={getUserDetails(friend).avatar || ""}
				alt={getUserDetails(friend).name || ""}
				size={36}
			/>
			<div className={classes("__details")}>
				<Typography size="md">{getUserDetails(friend).name}</Typography>
				<Typography size="sm">
					{getUserDetails(friend).email}
				</Typography>
			</div>
			<Typography className={classes("__icon")}>
				{friend.strings}
			</Typography>
		</div>
	);
};
