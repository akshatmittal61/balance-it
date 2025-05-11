export type AppTheme = "light" | "dark";
export type AppNetworkStatus = "online" | "offline";
export type Navigation = {
	title: string;
	icon: React.ReactNode;
	route: string;
	options?: Array<Omit<Navigation, "options">>;
};
