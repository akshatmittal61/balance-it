import { AuthApi, UserApi } from "@/api";
import { useHttpClient } from "@/hooks";
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
	sync: () => Promise<void>;
	isLoading: boolean;
	isUpdating: boolean;
	update: (_: Partial<IUser>) => Promise<void>;
	logout: () => Promise<void>;
};

type AuthStoreHook = (_?: Options) => ReturnType;

export const useAuthStore: AuthStoreHook = (options = {}) => {
	const store = useStore();
	const [isLoading, setIsLoading] = useState(false);
	const { loading: isUpdating, call: updateApi } = useHttpClient<IUser>();

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

	const updateProfile = async (body: Partial<IUser>) => {
		const updated = await updateApi(UserApi.updateUser, body);
		store.setUser(updated);
	};

	const logout = async () => {
		await AuthApi.logout();
		store.setUser(null);
		store.setIsLoggedIn(false);
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
		isUpdating,
		sync,
		update: updateProfile,
		logout,
	};
};
