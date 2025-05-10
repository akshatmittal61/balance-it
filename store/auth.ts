import { AuthApi } from "@/api";
import { IUser } from "@/types";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createSelectors } from "./utils";

type State = {
	user: IUser | null;
	isLoggedIn: boolean;
};

type Setter<T extends keyof State> = (_: State[T]) => void;

type Action = {
	setUser: Setter<"user">;
	setIsLoggedIn: Setter<"isLoggedIn">;
};

type Store = State & Action;

const store = create<Store>((set, get) => {
	return {
		user: null,
		isLoggedIn: false,
		getUser: () => get().user,
		getIsLoggedIn: () => get().isLoggedIn,
		setUser: (user) => set({ user }),
		setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
	};
});

const useStore = createSelectors(store);

type Options = {
	syncOnMount?: boolean;
};

type ReturnType = Store & {
	sync: () => void;
	isLoading: boolean;
};

type AuthStoreHook = (_?: Options) => ReturnType;

export const useAuthStore: AuthStoreHook = (options = {}) => {
	const store = useStore();
	const [isLoading, setIsLoading] = useState(false);

	const sync = async () => {
		try {
			setIsLoading(true);
			const res = await AuthApi.verify();
			store.setUser(res.data);
			store.setIsLoggedIn(true);
		} catch {
			store.setUser(null);
			store.setIsLoggedIn(false);
		} finally {
			setIsLoading(false);
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
		isLoading,
		sync,
	};
};
