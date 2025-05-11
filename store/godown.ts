import { UserApi } from "@/api";
import { Friend } from "@/types";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createSelectors } from "./utils";

type State = {
	friends: Array<Friend>;
};

type Getter<T extends keyof State> = () => State[T];
type Setter<T extends keyof State> = (_: State[T]) => void;

type Action = {
	getFriends: Getter<"friends">;
	setFriends: Setter<"friends">;
};

type Store = State & Action;

const store = create<Store>((set, get) => {
	return {
		friends: [],
		getFriends: () => get().friends,
		setFriends: (friends) => set({ friends }),
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
	const [isLoading, setIsLoading] = useState(false);

	const sync = async () => {
		try {
			setIsLoading(true);
			const res = await UserApi.getUserFriends();
			store.setFriends(res.data);
		} catch {
			store.setFriends([]);
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
