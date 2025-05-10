import { appTheme } from "@/constants";
import { AppNetworkStatus, AppTheme } from "@/types";
import { hexToRgb, Notify } from "@/utils";
import { useEffect } from "react";
import { create } from "zustand";
import { createSelectors } from "./utils";

type State = {
	vh: number;
	theme: AppTheme;
	accentColor: string;
	networkStatus: AppNetworkStatus;
};

type Getter<T extends keyof State> = () => State[T];
type Setter<T extends keyof State> = (_: State[T]) => void;

type Action = {
	getVh: Getter<"vh">;
	getTheme: Getter<"theme">;
	getAccentColor: Getter<"accentColor">;
	getNetworkStatus: Getter<"networkStatus">;
	setVh: Setter<"vh">;
	setTheme: Setter<"theme">;
	setAccentColor: Setter<"accentColor">;
	setNetworkStatus: Setter<"networkStatus">;
};

type Store = State & Action;

const store = create<Store>((set, get) => {
	return {
		vh: 0,
		theme: appTheme?.light || "light",
		accentColor: "0, 0, 0",
		networkStatus: "online",
		getVh: () => get().vh,
		getTheme: () => get().theme,
		getAccentColor: () => get().accentColor,
		getNetworkStatus: () => get().networkStatus,
		setVh: (vh) => set({ vh }),
		setTheme: (theme) => {
			set({ theme });
			document.body.dataset.theme = theme;
			localStorage.setItem("theme", theme);
		},
		setAccentColor: (accentColor) => set({ accentColor }),
		setNetworkStatus: (networkStatus) => set({ networkStatus }),
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
			.getPropertyValue("--accent-color-heavy")
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
			store.setTheme(appTheme.dark);
		} else {
			store.setTheme(appTheme.light);
		}
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
	};
};
