import { Navigation, NavigationId } from "@/types";
import { FiCalendar, FiHome, FiPackage, FiUsers } from "react-icons/fi";
import { navigationIds } from "./enum";
import { routes } from "./routes";

export const navigationMap: Record<NavigationId, Navigation> = {
	[navigationIds.home]: {
		id: navigationIds.home,
		title: "Home",
		icon: <FiHome />,
		route: routes.HOME,
	},
	[navigationIds.summary]: {
		id: navigationIds.summary,
		title: "My Summary",
		icon: <FiPackage />,
		route: routes.SUMMARY,
	},
	[navigationIds.friends]: {
		id: navigationIds.friends,
		title: "Friends",
		icon: <FiUsers />,
		route: routes.FRIENDS,
	},
	[navigationIds.calendar]: {
		id: navigationIds.calendar,
		title: "Calendar",
		icon: <FiCalendar />,
		route: routes.CALENDAR,
	},
};

export const sideBarLinks: Array<Navigation> = [
	navigationMap[navigationIds.home],
	navigationMap[navigationIds.summary],
	navigationMap[navigationIds.friends],
	navigationMap[navigationIds.calendar],
];
