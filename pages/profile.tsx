import { Seo } from "@/components";
import { withAuthPage } from "@/connections";
import { AppSeo, routes } from "@/constants";
import { Responsive } from "@/layouts";
import { Avatar, Button, Input, Typography } from "@/library";
import { useAuthStore } from "@/store";
import styles from "@/styles/pages/Profile.module.scss";
import { IUser } from "@/types";
import { getUserDetails, Notify, stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";

const classes = stylesConfig(styles, "profile-page");

type ProfilePageProps = { user: IUser };

const ProfilePage: React.FC<ProfilePageProps> = () => {
	const router = useRouter();
	const { user, logout, update, isUpdating, isLoggedIn } = useAuthStore();
	const [fields, setFields] = useState({
		name: "",
		phone: "",
		avatar: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFields({
			...fields,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await update(fields);
		Notify.success("Updated successfully");
	};

	const logoutUser = async () => {
		await logout();
		router.push(routes.LOGIN);
	};

	useEffect(() => {
		if (user) {
			setFields({
				name: user.name || "",
				phone: user.phone || "",
				avatar: user.avatar || "",
			});
		}
	}, [user]);

	return (
		<>
			<Seo title={`${user?.name} - Profile | ${AppSeo.title}`} />
			<main className={classes("")}>
				<div className={classes("-banner")}>
					<button
						onClick={() => router.back()}
						className={classes("-banner-btn")}
					>
						<FiArrowLeft />
					</button>
					<button
						onClick={logoutUser}
						className={classes("-banner-btn", "-banner-btn--flat")}
					>
						<FiLogOut />
						<Typography size="s">Logout</Typography>
					</button>
				</div>
				<div className={classes("-meta")}>
					{user ? (
						<Avatar
							src={getUserDetails(user).avatar || ""}
							alt={getUserDetails(user).name || ""}
							size={160}
						/>
					) : (
						<div className="size-40 rounded-full bg-gray-200 animate-pulse"></div>
					)}
				</div>
				<form className={classes("-form")} onSubmit={handleSubmit}>
					<Responsive.Row>
						<Responsive.Col
							xlg={50}
							lg={50}
							md={50}
							sm={100}
							xsm={100}
							className={classes("-form-col")}
						>
							{isLoggedIn ? (
								<Input
									label="Name"
									name="name"
									type="text"
									required
									placeholder="Name"
									value={fields.name}
									onChange={handleChange}
								/>
							) : (
								<div className="w-full h-10 bg-gray-200 animate-pulse"></div>
							)}
						</Responsive.Col>
						<Responsive.Col
							xlg={50}
							lg={50}
							md={50}
							sm={100}
							xsm={100}
							className={classes("-form-col")}
						>
							{isLoggedIn ? (
								<Input
									label="Phone"
									name="phone"
									type="tel"
									required
									placeholder="Phone"
									value={fields.phone}
									onChange={handleChange}
								/>
							) : (
								<div className="w-full h-10 bg-gray-200 animate-pulse"></div>
							)}
						</Responsive.Col>
						<Responsive.Col
							xlg={100}
							lg={100}
							md={100}
							sm={100}
							xsm={100}
							className={classes("-form-col")}
						>
							{isLoggedIn ? (
								<Input
									label="Avatar"
									name="avatar"
									type="url"
									required
									placeholder="Avatar"
									value={fields.avatar}
									onChange={handleChange}
								/>
							) : (
								<div className="w-full h-10 bg-gray-200 animate-pulse"></div>
							)}
						</Responsive.Col>
						<Responsive.Col
							xlg={100}
							lg={100}
							md={100}
							sm={100}
							xsm={100}
							className={classes("-form-col", "-form-col--btn")}
						>
							{isLoggedIn ? (
								<Button
									type="submit"
									loading={isUpdating}
									className={classes("-form-btn")}
									size="large"
								>
									Save
								</Button>
							) : null}
						</Responsive.Col>
					</Responsive.Row>
				</form>
			</main>
		</>
	);
};

export default ProfilePage;
export const getServerSideProps = withAuthPage<ProfilePageProps>((user) => ({
	props: { user },
}));
