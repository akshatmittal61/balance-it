import { UserApi } from "@/api";
import { regex } from "@/constants";
import { useHttpClient } from "@/hooks";
import { Button, Typography } from "@/library";
import { IUser } from "@/types";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import React from "react";
import styles from "./styles.module.scss";

const graphics = {
	thinking: {
		src: "/animations/thinking.gif",
		alt: "thinking...",
	},
	searching: {
		src: "/animations/searching.gif",
		alt: "searching...",
	},
	alone: {
		src: "/animations/alone.gif",
		alt: "alone...",
	},
};

type PlaceholderProps = {
	image?: {
		src: string;
		alt: string;
	};
	title?: React.ReactNode;
	subtitle?: string;
	action?: {
		label: string;
		action: () => void;
		loading?: boolean;
	};
};

type IMembersPlaceholderProps = {
	loading: boolean;
	searchStr: string;
	onInvited?: (_: IUser) => void;
};

type InviteMemberProps = {
	email: string;
	onInvited: (_: IUser) => void;
};

const classes = stylesConfig(styles, "members-placeholder");

const Placeholder: React.FC<PlaceholderProps> = ({
	image,
	title,
	subtitle,
	action,
}) => {
	return (
		<div className={classes("")}>
			{image ? (
				<Image
					src={image.src}
					alt={image.alt}
					width={500}
					height={500}
					unoptimized
				/>
			) : null}
			{title ? <Typography size="xxl">{title}</Typography> : null}
			{subtitle ? <Typography>{subtitle}</Typography> : null}
			{action ? (
				<Button
					className={classes("-button")}
					type="button"
					onClick={action.action}
					loading={action.loading}
					size="large"
				>
					{action.label}
				</Button>
			) : null}
		</div>
	);
};

const InviteMember: React.FC<InviteMemberProps> = ({ onInvited, email }) => {
	const { loading: inviting, call } = useHttpClient();
	const inviteMember = async () => {
		if (onInvited) {
			const user = await call(UserApi.inviteUser, email);
			onInvited(user);
		}
	};
	return (
		<Placeholder
			title={"Seems like you friend has not joined us yet."}
			image={graphics.thinking}
			subtitle="Want to invite them?"
			action={{
				label: "Invite",
				action: inviteMember,
				loading: inviting,
			}}
		/>
	);
};

const MembersPlaceholder: React.FC<IMembersPlaceholderProps> = ({
	loading,
	searchStr,
	onInvited,
}) => {
	if (loading) {
		return (
			<Placeholder
				image={graphics.searching}
				title="Looking for your friends..."
			/>
		);
	}
	if (searchStr.length > 0 && searchStr.length < 3) {
		return (
			<Placeholder
				image={graphics.thinking}
				title="Please type at least 3 characters of user email"
			/>
		);
	}
	if (searchStr.length >= 3) {
		if (!regex.email.test(searchStr)) {
			return (
				<Placeholder
					image={graphics.thinking}
					title="Couldn't find your friend"
					subtitle="Tip: Enter their email to invite them"
				/>
			);
		}
		if (onInvited) {
			return <InviteMember email={searchStr} onInvited={onInvited} />;
		}
	}
	return (
		<Placeholder
			image={graphics.alone}
			title="You're so alone..."
			subtitle="Tip: Make friends"
		/>
	);
};

export default MembersPlaceholder;
