import { Header, Seo, SideBar } from "@/components";
import { AppSeo, routes } from "@/constants";
import { useDevice } from "@/hooks";
import { useAuthStore, useUiStore } from "@/store";
import { IUser } from "@/types";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import styles from "./styles.module.scss";

interface WrapperProps {
	children: React.ReactNode;
	user?: IUser;
}

const classes = stylesConfig(styles, "wrapper");

export const Wrapper: React.FC<WrapperProps> = ({ children, user }) => {
	const router = useRouter();
	const { setUser } = useAuthStore({ syncOnMount: true });
	const {
		setOpenSidebar,
		syncNetworkStatus,
		sync: syncUiState,
	} = useUiStore();
	const { device } = useDevice();
	const pagesSupportingContainer: Array<string> = [
		routes.HOME,
		routes.SUMMARY,
		routes.FRIENDS,
		routes.CALENDAR,
		routes.PROFILE,
	];
	useEffect(() => {
		if (user) {
			setUser(user);
		}
		syncUiState();
		setInterval(() => {
			syncNetworkStatus();
		}, 5000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (device === "mobile") {
			setOpenSidebar(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [device, router.pathname]);
	return (
		<>
			<Seo
				title={AppSeo.title}
				description={AppSeo.description}
				image={AppSeo.image}
				canonical={AppSeo.canonical}
				themeColor={AppSeo.themeColor}
				icons={AppSeo.icons}
				twitter={AppSeo.twitter}
				og={AppSeo.og}
			/>
			{pagesSupportingContainer.includes(router.pathname) ? (
				<>
					<Header />
					<SideBar />
				</>
			) : null}
			<main
				className={
					pagesSupportingContainer.includes(router.pathname)
						? classes("")
						: ""
				}
			>
				{children}
			</main>
			<Toaster position="top-center" />
		</>
	);
};
