export type AddExpenseWizardProps = {};

export type TagProps = {
	tag: string;
	active?: boolean;
	onClick?: () => void;
	onRemove?: () => void;
	className?: string;
};

export type AddTagProps = {
	onAdd: (_: string) => void;
};
