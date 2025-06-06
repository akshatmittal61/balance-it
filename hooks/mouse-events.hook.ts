import { RefObject, useEffect } from "react";

type AnyEvent = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement | null = HTMLElement>(
	ref: RefObject<T>,
	handler: (_: AnyEvent) => void
): void => {
	useEffect(() => {
		const listener = (event: AnyEvent) => {
			const el = ref?.current;

			// Do nothing if clicking ref's element or descendent elements

			if (!el || el.contains(event.target as Node)) {
				return;
			}

			handler(event);
		};

		document.addEventListener("mousedown", listener);

		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);

			document.removeEventListener("touchstart", listener);
		};

		// Reload only if ref or handler changes
	}, [ref, handler]);
};
