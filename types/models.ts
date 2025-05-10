import { T_USER_ROLE } from "./enum";
import { Model } from "./parser";

/**
 * User model
 * @param {string} name - Name of the user (optional - defaults to email prefix)
 * @param {string} email - Email of the user
 * @param {string} role - Role of the user - ADMIN | MEMBER | GUEST
 */
export type User = Model<{
	name?: string;
	email: string;
	role: T_USER_ROLE;
}>;
