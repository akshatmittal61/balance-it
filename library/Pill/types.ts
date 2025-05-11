import { T_COMPONENT_THEME } from "@/types";

export type PillProps = {
	size?: "small" | "medium" | "large";
	variant?: "filled" | "outlined";
	updatable?: boolean;
	label: string;
	icon?: React.ReactNode;
	dot?: boolean;
	theme?: T_COMPONENT_THEME | "metal";
	options?: Array<{ label: string; value: string }>;
	loading?: boolean;
	onSelect?: (_: string) => void;
	onRemove?: () => void;
};
