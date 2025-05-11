import { IUser } from "@/types";
import { DistributionMethod, ExpenseUser } from "./distribution/types";
export * from "./distribution/types";

export type MembersWindowProps = {
	defaultMethod: DistributionMethod;
	members: Array<ExpenseUser>;
	setMembers: (_: Array<ExpenseUser>) => void;
	totalAmount: number;
};

export type MembersUserProps = IUser & {
	index: number;
	isSelected?: boolean;
	onSelect?: () => void;
};

export type SplitsPlaceholderProps = {
	loading: boolean;
	searchStr: string;
	onInvited: (_: IUser) => void;
};

export type BulkEditorProps = {
	selectedMembers: Array<IUser>;
	setSelectedMembers: (_: Array<IUser>) => void;
};
