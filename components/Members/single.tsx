import { Avatar, Typography } from "@/library";
import { IUser } from "@/types";
import { getUserDetails, stylesConfig } from "@/utils";
import React from "react";
import { FiX } from "react-icons/fi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import styles from "./styles.module.scss";

type MemberProps = {
	user: IUser;
	isSelected?: boolean;
	interactive?: boolean;
	onSelect?: () => void;
};

export const MemberRow: React.FC<MemberProps> = ({
	user,
	isSelected,
	interactive = true,
	onSelect,
}) => {
	const classes = stylesConfig(styles, "members-row");
	return (
		<div
			className={classes("", {
				"--interactive": interactive,
			})}
			onClick={onSelect}
		>
			<Avatar
				src={getUserDetails(user).avatar || ""}
				alt={getUserDetails(user).name || ""}
				size={36}
			/>
			<div className={classes("__details")}>
				<Typography size="md">{getUserDetails(user).name}</Typography>
				<Typography size="sm">{getUserDetails(user).email}</Typography>
			</div>
			{isSelected ? (
				<IoIosCheckmarkCircle className={classes("__icon")} />
			) : null}
		</div>
	);
};

export const MemberIcon: React.FC<MemberProps> = ({ user, onSelect }) => {
	const classes = stylesConfig(styles, "members-icon");
	return (
		<div className={classes("")} title={getUserDetails(user).email}>
			<FiX onClick={onSelect} className={classes("-cross")} />
			<Avatar
				src={getUserDetails(user).avatar || ""}
				alt={getUserDetails(user).name || ""}
				size={48}
			/>
			<Typography size="md" weight="medium" className={classes("-name")}>
				{getUserDetails(user).name}
			</Typography>
		</div>
	);
};
