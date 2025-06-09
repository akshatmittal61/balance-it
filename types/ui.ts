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

// Action Bar Atoms
type ActionBarBaseAtom = {
	id: string;
	icon: React.ReactNode;
	styles?: React.CSSProperties;
};
type ActionBarClickAtom = ActionBarBaseAtom & { onClick: () => void };
type ActionBarHrefAtom = ActionBarBaseAtom & {
	href: string;
	target?: string;
};
type ActionBarDrawerAtom = ActionBarBaseAtom & {
	drawer: (_: { onClose: () => void }) => React.ReactNode;
};
export type ActionBarAtom =
	| ActionBarClickAtom
	| ActionBarHrefAtom
	| ActionBarDrawerAtom;
