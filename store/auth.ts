import { AuthApi, UserApi } from "@/api";
import { useHttpClient } from "@/hooks";
import { IUser } from "@/types";
import { useEffect } from "react";
import { create } from "zustand";
import { createSelectors } from "./utils";

type State = {
	user: IUser | null;
	isLoading: boolean;
	isLoggedIn: boolean;
};

type Getter<T extends keyof State> = () => State[T];
type Setter<T extends keyof State> = (_: State[T]) => void;

type Action = {
	getUser: Getter<"user">;
	getIsLoading: Getter<"isLoading">;
	getIsLoggedIn: Getter<"isLoggedIn">;
	setUser: Setter<"user">;
	setIsLoading: Setter<"isLoading">;
	setIsLoggedIn: Setter<"isLoggedIn">;
};

type Store = State & Action;

const store = create<Store>((set, get) => {
	return {
		user: null,
		isLoading: false,
		isLoggedIn: false,
		getUser: () => get().user,
		getIsLoading: () => get().isLoading,
		getIsLoggedIn: () => get().isLoggedIn,
		setUser: (user) => set({ user }),
		setIsLoading: (isLoading) => set({ isLoading }),
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
	const { loading: isUpdating, call: updateApi } = useHttpClient<IUser>();

	const sync = async () => {
		try {
			store.setIsLoading(true);
			const res = await AuthApi.verify();
			store.setUser(res.data);
			store.setIsLoggedIn(true);
		} catch {
			store.setUser(null);
			store.setIsLoggedIn(false);
		} finally {
			store.setIsLoading(false);
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
		isUpdating,
		sync,
		update: updateProfile,
		logout,
	};
};
