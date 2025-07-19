import { IUser } from "../client";

// Auth
export type VerifyGoogleOAuth = { code: string };
export type ContinueGoogleOAuth = { token: string };
export type VerifyUser = IUser;
export type RequestOtp = { email: string };
export type VerifyOtp = { email: string; otp: string };
export type Logout = null;

// User
export type UpdateUser = Partial<IUser>;
export type SearchUsers = { query: string };
export type InviteUser = { email: string };
export type BulkUserSearch = { query: string };
export type GetUserFriends = null;

// Wallet
export type { CreateExpense } from "../client";
export type { WalletDashboardOptions } from "../wallet";
export type SettleSplitInExpense = {
	expense: string;
	split: string;
	// amount: number;
};
