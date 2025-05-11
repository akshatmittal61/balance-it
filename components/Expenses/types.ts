export type AddExpenseWizardProps = {};

export type TagProps = {
	tag: string;
	active?: boolean;
	onClick?: () => void;
	onRemove?: () => void;
	className?: string;
};

export type AddExpenseScreen = "default" | "splits";
