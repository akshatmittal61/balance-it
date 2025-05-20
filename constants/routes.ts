export const routes = Object.freeze({
	ROOT: "/",
	ABOUT: "/about",
	CONTACT: "/contact",
	HOME: "/home",
	SUMMARY: "/summary",
	FRIENDS: "/friends",
	CALENDAR: "/calendar",
	ADD_EXPENSE: "/add-expense",
	LOGIN: "/login",
	ERROR: "/500",
	PROFILE: "/profile",
	PRIVACY_POLICY: "/privacy-policy",
});

export const protectedRoutes: Array<string> = [
	routes.PROFILE,
	routes.HOME,
	routes.SUMMARY,
	routes.FRIENDS,
	routes.CALENDAR,
	routes.ADD_EXPENSE,
];

export const nonProtectedRoutes: Array<string> = [
	routes.ROOT,
	routes.LOGIN,
	routes.ABOUT,
	routes.CONTACT,
	routes.PRIVACY_POLICY,
	routes.ERROR,
];

export const routesSupportingContainer: Array<string> = [
	routes.PROFILE,
	routes.HOME,
	routes.SUMMARY,
	routes.FRIENDS,
	routes.CALENDAR,
	routes.ADD_EXPENSE,
];

export const redirectToLogin = (currentPath: string) => {
	return `${routes.LOGIN}?redirect=${currentPath}`;
};
