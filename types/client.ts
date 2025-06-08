import { AuthMapping, Expense, Group, Member, Split, User } from "./models";
import { CreateModel, UpdateModel } from "./parser";

export type IUser = User;
export type CollectionUser = { name: string; email: string };
export type UpdateUser = Omit<UpdateModel<User>, "email">;
export type IAuthMapping = Omit<AuthMapping, "user"> & { user: IUser | null };
export type IMember = Omit<Member, "user"> & { user: IUser };
export type IGroup = Omit<Group, "author"> & { author: IUser };
export type UserDetails = {
	name: string;
	phone: string;
	avatar: string;
};
export type IExpense = Omit<Expense, "author" | "group"> & {
	author: IUser;
	group?: IGroup;
};
export type ISplit = Omit<Split, "expense" | "user"> & {
	expense: IExpense;
	user: IUser;
};

export type SplitWithoutExpense = Omit<ISplit, "expense">;

export type ExpenseSpread = IExpense & {
	splits?: Array<SplitWithoutExpense>;
};

export type Friend = IUser & {
	strings: number;
};

export type CreateExpense = Omit<CreateModel<Expense>, "author" | "splits"> & {
	author: string;
	splits?: Array<{ user: string; amount: number }>;
};
