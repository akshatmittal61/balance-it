import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(
	initialValue: T,
	delay: number
): [T, T, (_: T) => void] {
	const [inputValue, setInputValue] = useState<T>(initialValue);
	const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
	// eslint-disable-next-line no-undef
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			setDebouncedValue(inputValue);
		}, delay);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [inputValue, delay]);

	return [inputValue, debouncedValue, setInputValue];
}
