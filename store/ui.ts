import { appTheme, sideBarLinks } from "@/constants";
import { AppNetworkStatus, AppTheme, Navigation } from "@/types";
import { hexToRgb, Notify } from "@/utils";
import { useEffect } from "react";
import { create } from "zustand";
import { createSelectors } from "./utils";

type State = {
	vh: number;
	theme: AppTheme;
	accentColor: string;
	networkStatus: AppNetworkStatus;
	isSidebarExpanded: boolean;
	sideBarLinks: Array<Navigation>;
};

type Getter<T extends keyof State> = () => State[T];
type Setter<T extends keyof State> = (_: State[T]) => void;

type Action = {
	getVh: Getter<"vh">;
	getTheme: Getter<"theme">;
	getAccentColor: Getter<"accentColor">;
	getNetworkStatus: Getter<"networkStatus">;
	getIsSidebarExpanded: Getter<"isSidebarExpanded">;
	getSideBarLinks: Getter<"sideBarLinks">;
	setVh: Setter<"vh">;
	setTheme: Setter<"theme">;
	setAccentColor: Setter<"accentColor">;
	setNetworkStatus: Setter<"networkStatus">;
	setIsSidebarExpanded: Setter<"isSidebarExpanded">;
	setSideBarLinks: Setter<"sideBarLinks">;
};

type Store = State & Action;

const store = create<Store>((set, get) => {
	return {
		// state
		vh: 0,
		theme: appTheme?.light || "light",
		accentColor: "0, 0, 0",
		networkStatus: "online",
		isSidebarExpanded: true,
		sideBarLinks: sideBarLinks,
		// getters
		getVh: () => get().vh,
		getTheme: () => get().theme,
		getAccentColor: () => get().accentColor,
		getNetworkStatus: () => get().networkStatus,
		getIsSidebarExpanded: () => get().isSidebarExpanded,
		getSideBarLinks: () => get().sideBarLinks,
		// setters
		setVh: (vh) => set({ vh }),
		setTheme: (theme) => {
			set({ theme });
			document.body.dataset.theme = theme;
		},
		setAccentColor: (accentColor) => set({ accentColor }),
		setNetworkStatus: (networkStatus) => set({ networkStatus }),
		setIsSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
		setSideBarLinks: (sideBarLinks) => set({ sideBarLinks }),
	};
});

const useStore = createSelectors(store);

type Options = {
	syncOnMount?: boolean;
};

type ReturnType = Store & {
	sync: () => void;
	syncNetworkStatus: () => void;
	toggleTheme: () => void;
	toggleSidebar: () => void;
	setOpenSidebar: (_: boolean) => void;
};

type UiStoreHook = (_?: Options) => ReturnType;

export const useUiStore: UiStoreHook = (options = {}) => {
	const store = useStore();

	const syncTheme = () => {
		const theme = localStorage.getItem("theme");
		if (theme && ["light", "dark"].includes(theme)) {
			store.setTheme(theme as AppTheme);
		} else {
			const h = window.matchMedia("(prefers-color-scheme: dark)");
			if (h.matches) {
				store.setTheme(appTheme.dark);
			} else {
				store.setTheme(appTheme.light);
			}
		}
		const accentColor = getComputedStyle(document.documentElement)
			.getPropertyValue("--accent-color")
			.trim();
		const accentColorRgb = hexToRgb(accentColor);
		store.setAccentColor(accentColorRgb);
	};

	const syncNetworkStatus = () => {
		const status = navigator.onLine ? "online" : "offline";
		store.setNetworkStatus(status);
		if (status === "offline") {
			Notify.error("You are offline");
		}
	};

	const sync = () => {
		syncTheme();
		syncNetworkStatus();
	};

	const toggleTheme = () => {
		if (store.theme === appTheme.light) {
			localStorage.setItem("theme", appTheme.dark);
			store.setTheme(appTheme.dark);
		} else {
			localStorage.setItem("theme", appTheme.light);
			store.setTheme(appTheme.light);
		}
	};

	const setOpenSidebar = (state: boolean) => {
		if (state === true) {
			document.body.style.setProperty(
				"--side-width",
				"var(--side-width-expanded)"
			);
		} else {
			document.body.style.setProperty(
				"--side-width",
				"var(--side-width-collapsed)"
			);
		}
		store.setIsSidebarExpanded(state);
	};

	const toggleSidebar = () => {
		if (store.isSidebarExpanded) {
			document.body.style.setProperty(
				"--side-width",
				"var(--side-width-collapsed)"
			);
		} else {
			document.body.style.setProperty(
				"--side-width",
				"var(--side-width-expanded)"
			);
		}
		store.setIsSidebarExpanded(!store.isSidebarExpanded);
	};

	useEffect(() => {
		if (options.syncOnMount) {
			sync();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options.syncOnMount]);

	return {
		...store,
		sync,
		syncNetworkStatus,
		toggleTheme,
		toggleSidebar,
		setOpenSidebar,
	};
};
