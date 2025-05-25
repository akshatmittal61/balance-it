import { ExpenseSpread, ExpensesSummary, Friend, IUser } from "../client";

// Auth
export type VerifyUser = IUser;
export type VerifyGoogleOAuth = string;
export type ContinueGoogleOAuth = IUser;
export type RequestOtp = null;
export type VerifyOtp = IUser;
export type Logout = null;

// User
export type UpdateUser = IUser;
export type SearchUsers = Array<IUser>;
export type InviteUser = IUser;
export type BulkUserSearch = {
	users: Array<IUser>;
	message: string;
};
export type GetUserFriends = Array<Friend>;

// Wallet
export type GetUserExpenses = Array<ExpenseSpread>;
export type GetExpensesSummary = ExpensesSummary;
export type GetExpenseById = ExpenseSpread;
export type CreateExpense = ExpenseSpread;
export type DeleteExpense = boolean;
