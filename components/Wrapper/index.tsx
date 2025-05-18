import { Header, Loader, Seo, SideBar } from "@/components";
import { AppSeo, routesSupportingContainer } from "@/constants";
import { useDevice } from "@/hooks";
import { useAuthStore, useUiStore } from "@/store";
import { IUser } from "@/types";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import styles from "./styles.module.scss";

interface WrapperProps {
	children: React.ReactNode;
	user?: IUser;
}

const classes = stylesConfig(styles, "wrapper");

export const Wrapper: React.FC<WrapperProps> = ({ children, user }) => {
	const router = useRouter();
	const [showLoader, setShowLoader] = useState(false);
	const { sync: syncAuth, setUser } = useAuthStore({ syncOnMount: true });
	const { setOpenSidebar, syncNetworkStatus } = useUiStore({
		syncOnMount: true,
	});
	const { device } = useDevice();

	// only show router when route is changing
	useEffect(() => {
		router.events.on("routeChangeStart", () => {
			setShowLoader(true);
		});
		router.events.on("routeChangeComplete", () => {
			setShowLoader(false);
		});
		router.events.on("routeChangeError", () => {
			setShowLoader(false);
		});
	}, [router.events]);

	useEffect(() => {
		if (user) {
			setUser(user);
		}
		setInterval(() => {
			syncNetworkStatus();
		}, 5000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (device === "mobile") {
			setOpenSidebar(false);
		}
		syncAuth();
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
			{routesSupportingContainer.includes(router.pathname) ? (
				<>
					<Header />
					<SideBar />
				</>
			) : null}
			{showLoader ? <Loader.Bar /> : null}
			<main
				className={
					routesSupportingContainer.includes(router.pathname)
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
