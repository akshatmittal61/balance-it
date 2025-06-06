import { Cache } from "@/cache";
import {
	AppSeo,
	cacheParameter,
	emailTemplates,
	HTTP,
	USER_ROLE,
	USER_STATUS,
} from "@/constants";
import { ApiError } from "@/errors";
import { Logger } from "@/log";
import { splitRepo, userRepo } from "@/repo";
import {
	CollectionUser,
	CreateModel,
	Friend,
	IUser,
	UpdateUser,
	User,
} from "@/types";
import { genericParse, getNonEmptyString } from "@/utils";
import { sendBulkEmailTemplate, sendEmailTemplate } from "./email";

export class UserService {
	public static async getUserById(id: string): Promise<IUser | null> {
		const cacheKey = Cache.getKey(cacheParameter.USER, { id });
		return await Cache.fetch(cacheKey, () => userRepo.findById(id));
	}
	public static async getUserByEmail(email: string): Promise<IUser | null> {
		try {
			return await userRepo.findOne({ email });
		} catch {
			return null;
		}
	}
	public static async findOrCreateUser(
		body: CreateModel<User>
	): Promise<{ user: IUser; isNew: boolean }> {
		const email = genericParse(getNonEmptyString, body.email);
		const foundUser = await userRepo.findOne({ email });
		if (foundUser) {
			return { user: foundUser, isNew: false };
		}
		const createdUser = await userRepo.create(body);
		return { user: createdUser, isNew: true };
	}
	public static async updateUserProfile(
		id: string,
		body: UpdateUser
	): Promise<IUser> {
		const updatedUser = await userRepo.update({ id }, body);
		if (!updatedUser) {
			throw new ApiError(HTTP.status.NOT_FOUND, "User not found");
		}
		const cacheKey = Cache.getKey(cacheParameter.USER, { id });
		Cache.invalidate(cacheKey);
		return updatedUser;
	}
	public static async searchByEmail(
		emailQuery: string
	): Promise<Array<IUser>> {
		if (!emailQuery) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Email query is required"
			);
		}
		if (emailQuery.length < 3) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Email query too short"
			);
		}
		const query = emailQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const res = await userRepo.find({
			email: { $regex: query, $options: "i" },
		});
		if (!res) return [];
		return res;
	}
	public static async invite(email: string, invitedByUser: IUser) {
		await sendEmailTemplate(
			email,
			`Invite to ${AppSeo.title}`,
			emailTemplates.USER_INVITED,
			{
				invitedBy: {
					email: invitedByUser?.email,
					name: invitedByUser?.name,
				},
			}
		);
	}
	public static async inviteUser(
		invitedByUserId: string,
		invitee: string
	): Promise<IUser> {
		if (invitedByUserId === invitee) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"You cannot invite yourself"
			);
		}
		const userExists = await UserService.getUserById(invitee);
		if (userExists) {
			throw new ApiError(HTTP.status.CONFLICT, "User already exists");
		}
		const invitedByUser = await UserService.getUserById(invitedByUserId);
		if (!invitedByUser) {
			throw new ApiError(
				HTTP.status.NOT_FOUND,
				"Invited by user not found"
			);
		}
		await this.invite(invitee, invitedByUser);
		const createdUser = await userRepo.create({
			email: invitee,
			status: USER_STATUS.INVITED,
			invitedBy: invitedByUserId,
			role: USER_ROLE.MEMBER,
		});
		return createdUser;
	}
	public static async inviteMany(emails: string[], invitedByUser: IUser) {
		await userRepo.bulkCreate(
			emails.map((email) => ({
				name: email.split("@")[0],
				email,
				status: USER_STATUS.INVITED,
				invitedBy: invitedByUser.id,
				role: USER_ROLE.MEMBER,
			}))
		);
		await sendBulkEmailTemplate(
			emails,
			`Invite to ${AppSeo.title}`,
			emailTemplates.USER_INVITED,
			{
				invitedBy: {
					email: invitedByUser?.email,
					name: invitedByUser?.name,
				},
			}
		);
	}
	private static isValidEmail(email: string): boolean {
		const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	}
	private static capitalizeName(name: string): string {
		return name
			.split(/\s+/)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(" ");
	}
	private static getDistinctFriends(users: Array<IUser>): Array<Friend> {
		const m = new Map<string, Friend>();
		users.forEach((user) => {
			if (!m.has(user.id)) {
				m.set(user.id, {
					...user,
					strings: 1,
				});
			} else {
				const currState = m.get(user.id)!;
				m.set(user.id, {
					...user,
					strings: currState.strings + 1,
				});
			}
		});
		const finals: Array<Friend> = [];
		m.forEach((value) => {
			finals.push(value);
		});
		return finals;
	}
	private static getDistinctUsersFromCollection = (
		users: Array<CollectionUser>
	) => {
		const m = new Map();
		users.forEach((user) => {
			if (m.has(user.email)) {
				const us = m.get(user.email);
				m.set(user.email, [...us, user.name]);
			} else {
				m.set(user.email, [user.name]);
			}
		});
		const finals: Array<CollectionUser> = [];
		m.forEach((value, key) => {
			const email = key;
			let name = value[0];
			if (value.length === 0) {
				name = UserService.capitalizeName(email.split("@")[0]);
			} else if (value.length === 1) {
				name = value[0];
			} else {
				for (const v of value) {
					if (v.length > name.length) {
						name = v;
					}
				}
			}
			finals.push({ name, email });
		});
		return finals;
	};
	private static parseBulkEmailInput(value: string): Array<CollectionUser> {
		const a = value
			.split(",")
			.map((a) => a.split(";"))
			.flat()
			.map((a) => a.trim());
		const valids = a
			.map((e) => {
				const r = /^([^<]+)?<([\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,})>$/;
				const f = e.match(r);
				if (f) {
					const email = f?.[2]?.trim();
					if (!UserService.isValidEmail(email)) {
						return null;
					}
					const trimmedName = f?.[1]?.trim() || email?.split("@")[0];
					const obj = {
						name: UserService.capitalizeName(trimmedName),
						email,
					};
					return obj;
				} else {
					const potentialEmails = e.split(/[;,\s]+/);
					const result = [];

					for (const item of potentialEmails) {
						let name = null;
						let email = null;
						if (UserService.isValidEmail(item)) {
							email = item.trim();
						}

						if (email) {
							name = name || email.split("@")[0];

							result.push({
								name: UserService.capitalizeName(name),
								email: email,
							});
						}
					}
					return result;
				}
			})
			.flat()
			.filter((f) => f != null);
		return UserService.getDistinctUsersFromCollection(valids);
	}
	public static async searchInBulk(
		query: string,
		invitee: IUser
	): Promise<{
		users: Array<IUser>;
		message: string;
	}> {
		const usersFromQuery = UserService.parseBulkEmailInput(query);
		Logger.debug("usersFromQuery", usersFromQuery, invitee);
		const emails = usersFromQuery.map((user) => user.email);
		Logger.debug("emails", emails);
		const users = await Promise.all(emails.map(UserService.getUserByEmail));
		const allFoundUsers = users.filter((user) => user !== null);
		const nonFoundUsers = emails.filter(
			(email) => !allFoundUsers.find((user) => user.email === email)
		);
		if (nonFoundUsers.length > 0) {
			Logger.debug("nonFoundUsers", nonFoundUsers);
			await UserService.inviteMany(nonFoundUsers, invitee);
		}
		const newUsersCollection = await Promise.all(
			emails.map(UserService.getUserByEmail)
		);
		const finalCollection = newUsersCollection.filter(
			(user) => user !== null
		);
		const message =
			nonFoundUsers.length > 0
				? `Invited ${nonFoundUsers.length} users`
				: "";
		return {
			users: finalCollection,
			message,
		};
	}
	public static async getFriendsForUser(
		userId: string
	): Promise<Array<Friend>> {
		// Get splits user is part of
		// this will include both
		// 	- splits of expenses authored by user
		// 	- splits of expenses authored by user's direct friends
		const splitsUserIsPartOf = await splitRepo.find({ user: userId });
		if (!splitsUserIsPartOf) return [];
		Logger.debug("splitsUserIsPartOf", splitsUserIsPartOf);
		// Get expenses authored by user
		const expensesAuthoredByUser = splitsUserIsPartOf
			.map((s) => s.expense)
			.filter((e) => e.author.id === userId);
		Logger.debug("expensesAuthoredByUser", expensesAuthoredByUser);
		const splitsForExpensesAuthoredByUser = await splitRepo.find({
			expense: { $in: expensesAuthoredByUser.map((e) => e.id) },
		});
		Logger.debug(
			"splitsForExpensesAuthoredByUser",
			splitsForExpensesAuthoredByUser
		);
		// Get direct friends
		const directFriendsFromForeignExpenses = splitsUserIsPartOf.map(
			(s) => s.expense.author
		);
		const directFriendsFromUserExpenses = (
			splitsForExpensesAuthoredByUser || []
		).map((s) => s.user);
		/* const allUsers = [
			...splitsUserIsPartOf,
			...(splitsForExpensesAuthoredByUser || []),
		].map((s) => s.expense.author); */
		const allUsers = [
			...directFriendsFromForeignExpenses,
			...directFriendsFromUserExpenses,
		];
		Logger.debug("authorsOfSplits", allUsers);
		// Get distinct users since the collection can have several duplicates
		// Also filter out the current user, since friendship can't be with oneself - sad life
		return UserService.getDistinctFriends(allUsers).filter(
			(a) => a.id !== userId
		);
	}
}
