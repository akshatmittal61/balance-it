import { UserApi } from "@/api";
import { regex } from "@/constants";
import { Button, Typography } from "@/library";
import { Notify } from "@/utils";
import Image from "next/image";
import React, { useState } from "react";
import { classes } from "./assets";
import { SplitsPlaceholderProps } from "./types";

export const SplitsPlaceholder: React.FC<SplitsPlaceholderProps> = ({
	loading,
	searchStr,
	onInvited,
}) => {
	const [inviting, setInviting] = useState(false);
	const inviteMember = async () => {
		try {
			setInviting(true);
			const res = await UserApi.inviteUser(searchStr);
			onInvited(res.data);
		} catch (error) {
			Notify.error(error);
		} finally {
			setInviting(false);
		}
	};
	if (loading) {
		return <p className={classes("-loading")}>Searching...</p>;
	}
	if (searchStr.length < 3) {
		return (
			<div className={classes("-placeholder")}>
				<Image
					src="/vectors/empty-records.svg"
					alt="empty-records"
					width={1920}
					height={1080}
				/>
				<Typography>
					Please type at least 3 characters of user email
				</Typography>
			</div>
		);
	}
	if (searchStr.length >= 3) {
		if (!regex.email.test(searchStr)) {
			return (
				<div className={classes("-placeholder")}>
					<Image
						src="/vectors/empty-records.svg"
						alt="empty-records"
						width={1920}
						height={1080}
					/>
					<Typography>Couldn&apos;t find any user</Typography>
					<Typography size="sm">
						Tip: Enter the email of the user to invite them
					</Typography>
				</div>
			);
		}
		return (
			<div className={classes("-placeholder")}>
				<Typography>
					Seems like{" "}
					<span style={{ color: "var(--accent-color-heavy)" }}>
						{searchStr}
					</span>{" "}
					has not joined us yet.
				</Typography>
				<Typography>Want to invite them?</Typography>
				<Button
					className={classes("-button")}
					type="button"
					onClick={inviteMember}
					loading={inviting}
				>
					Invite
				</Button>
			</div>
		);
	}
};
