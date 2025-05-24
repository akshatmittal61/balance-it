import { UserApi } from "@/api";
import { Friend } from "@/types";
import { useEffect } from "react";
import { create } from "zustand";
import { createSelectors } from "./utils";

type State = {
	friends: Array<Friend>;
	isLoading: boolean;
};

type Getter<T extends keyof State> = () => State[T];
type Setter<T extends keyof State> = (_: State[T]) => void;

type Action = {
	getFriends: Getter<"friends">;
	setFriends: Setter<"friends">;
	getIsLoading: Getter<"isLoading">;
	setIsLoading: Setter<"isLoading">;
};

type Store = State & Action;

const store = create<Store>((set, get) => {
	return {
		friends: [],
		isLoading: false,
		getFriends: () => get().friends,
		setFriends: (friends) => set({ friends }),
		getIsLoading: () => get().isLoading,
		setIsLoading: (isLoading) => set({ isLoading }),
	};
});

const useStore = createSelectors(store);

type Options = {
	syncOnMount?: boolean;
};

type ReturnType = Store & {
	isLoading: boolean;
	sync: () => void;
};

type GodownStoreHook = (_?: Options) => ReturnType;

export const useGodownStore: GodownStoreHook = (options = {}) => {
	const store = useStore();

	const sync = async () => {
		try {
			store.setIsLoading(true);
			const res = await UserApi.getUserFriends();
			store.setFriends(res.data);
		} catch {
			store.setFriends([]);
		} finally {
			store.setIsLoading(false);
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
		isLoading: store.getIsLoading(),
		sync,
	};
};
