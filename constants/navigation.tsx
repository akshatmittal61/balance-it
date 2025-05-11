import { Navigation } from "@/types";
import { FiCalendar, FiHome, FiPackage, FiUsers } from "react-icons/fi";
import { routes } from "./routes";

export const sideBarLinks: Array<Navigation> = [
	{
		title: "Home",
		icon: <FiHome />,
		route: routes.HOME,
	},
	{
		title: "My Summary",
		icon: <FiPackage />,
		route: routes.SUMMARY,
	},
	{
		title: "Friends",
		icon: <FiUsers />,
		route: routes.FRIENDS,
	},
	{
		title: "Calendar",
		icon: <FiCalendar />,
		route: routes.CALENDAR,
	},
];
