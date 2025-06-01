import React from "react";

export type AppTheme = "light" | "dark";
export type AppNetworkStatus = "online" | "offline";
export type NavigationId = "home" | "summary" | "friends" | "calendar";
export type Navigation = {
	id: string;
	title: string;
	icon: React.ReactNode;
	route: string;
	options?: Array<Omit<Navigation, "options">>;
};
