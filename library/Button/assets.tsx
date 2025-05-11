import { ButtonSize, ButtonTheme, ButtonVariant } from "./types";

export const BUTON_SIZES: Record<ButtonSize, string> = {
	small: "btn--size--small",
	medium: "btn--size--medium",
	large: "btn--size--large",
};

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
	filled: "btn--variant--filled",
	outlined: "btn--variant--outlined",
	text: "btn--variant--text",
};

export const BUTTON_THEMES: Record<ButtonTheme, string> = {
	default: "btn--theme--default",
	success: "btn--theme--success",
	error: "btn--theme--error",
	warning: "btn--theme--warning",
	info: "btn--theme--info",
};
