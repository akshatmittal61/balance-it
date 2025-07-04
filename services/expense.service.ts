import { Cache } from "@/cache";
import { cacheParameter, EXPENSE_TYPE, HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { Logger } from "@/log";
import {
	expenseRepo,
	groupRepo,
	memberRepo,
	splitRepo,
	userRepo,
} from "@/repo";
import {
	CreateModel,
	Expense,
	ExpenseSpread,
	IExpense,
	Split,
	T_EXPENSE_TYPE,
	UpdateQuery,
} from "@/types";
import { getNonNullValue } from "@/utils";
import { UserService } from "./user.service";
import { WalletService } from "./wallet.service";

export class ExpenseService {
	public static async getGroupExpenses(
		groupId: string
	): Promise<Array<IExpense>> {
		const expenses = await expenseRepo.find({ group: groupId });
		return expenses || [];
	}
	public static async getExpenseById(
		expenseId: string
	): Promise<IExpense | null> {
		const cacheKey = Cache.getKey(cacheParameter.EXPENSE, {
			id: expenseId,
		});
		return await Cache.fetch(cacheKey, () =>
			expenseRepo.findByIdWithSplits(expenseId)
		);
	}
	public static async getExpenseForUser(
		expenseId: string,
		userId: string
	): Promise<IExpense> {
		const expense = await ExpenseService.getExpenseById(expenseId);
		if (!expense) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Expense not found");
		}
		if (expense.author.id !== userId) {
			throw new ApiError(HTTP.status.FORBIDDEN, "None of your business");
		}
		return expense;
	}
	public static async getExpensesSummary(userId: string): Promise<{
		paid: number;
		received: number;
	}> {
		const expenses = await WalletService.getUserExpenses(userId, {});
		const totalPaidAmount = expenses.data
			.filter((exp) => exp.type === EXPENSE_TYPE.PAID)
			.reduce((acc, exp) => acc + exp.amount, 0);
		const totalReceivedAmount = expenses.data
			.filter((exp) => exp.type === EXPENSE_TYPE.RECEIVED)
			.reduce((acc, exp) => acc + exp.amount, 0);
		return {
			paid: totalPaidAmount,
			received: totalReceivedAmount,
		};
	}
	public static async createExpense(
		body: CreateModel<Expense>,
		userId: string,
		splits?: Array<{ user: string; amount: number }>
	): Promise<ExpenseSpread> {
		// --- Validations ---
		const foundAuthor = await UserService.getUserById(body.author);
		Logger.debug("Found author", foundAuthor);
		if (!foundAuthor) {
			throw new ApiError(HTTP.status.NOT_FOUND, "User not found");
		}
		if (!body.group && !splits) {
			if (body.author !== userId) {
				// Only the current user can add a personal expense
				// check if the user is the one adding the expense
				throw new ApiError(HTTP.status.UNAUTHORIZED, "Unauthorized");
			}
		}
		// check if the amount is valid
		if (isNaN(body.amount) || body.amount <= 0) {
			throw new ApiError(HTTP.status.BAD_REQUEST, "Invalid amount");
		}

		// --- Minimal parsing ---
		body.title = body.title.trim();
		body.tags = body.tags?.map((t) => t.trim().toLowerCase()) || [];

		// --- Group Expense ---
		if (body.group) {
			// check if the user is a member of the group
			const foundGroup = await groupRepo.findById(body.group);
			if (!foundGroup) {
				throw new ApiError(HTTP.status.NOT_FOUND, "Group not found");
			}
			const members = await memberRepo.find({ group: foundGroup.id });
			if (!members) {
				throw new ApiError(HTTP.status.NOT_FOUND, "Group not found");
			}
			if (!members.some((member) => member.user.id === userId)) {
				throw new ApiError(
					HTTP.status.UNAUTHORIZED,
					"You are not a member of this group"
				);
			}
			// check if splits are not provided
			if (!splits) {
				throw new ApiError(
					HTTP.status.BAD_REQUEST,
					"Splits are required for group expenses"
				);
			}
		}

		// --- Split Expense ---
		if (splits && splits.length > 0) {
			Logger.debug("Splits", splits);
			// check if the amount is distributed correctly
			const distributedAmounts = splits.reduce((acc, split) => {
				return acc + split.amount;
			}, 0);
			if (distributedAmounts !== body.amount) {
				throw new ApiError(
					HTTP.status.BAD_REQUEST,
					"Invalid split amounts"
				);
			}
			// check if the users exist
			const users = splits.map((split) => split.user);
			const foundUsers = await userRepo.find({ _id: { $in: users } });
			Logger.debug("Found users", users, foundUsers);
			if (!foundUsers) {
				throw new ApiError(HTTP.status.NOT_FOUND, "Users not found");
			}
			// check if everyone in the splits has some amount
			if (splits.some((split) => split.amount <= 0)) {
				throw new ApiError(
					HTTP.status.BAD_REQUEST,
					"Invalid split amounts"
				);
			}
		}

		// --- Create expense ---
		const expense = await expenseRepo.create({ ...body, author: userId });
		if (splits) {
			const splitsToCreate: Array<CreateModel<Split>> = splits.map(
				(split) => ({
					expense: expense.id,
					user: split.user,
					pending:
						expense.author.id === split.user ? 0 : split.amount,
					completed:
						expense.author.id === split.user ? split.amount : 0,
				})
			);
			await splitRepo.bulkCreate(splitsToCreate);
		}
		return getNonNullValue(await this.getExpenseById(expense.id));
	}
	public static async updateExpense({
		expenseId,
		loggedInUserId,
		title,
		amount,
		author,
		timestamp,
		group,
		tags,
		icon,
		type,
		method,
		splits,
	}: {
		expenseId: string;
		loggedInUserId: string;
		title?: string;
		amount?: number;
		author?: string;
		timestamp?: string;
		group?: string;
		tags?: string[];
		icon?: string;
		type?: T_EXPENSE_TYPE;
		method?: string;
		splits?: Array<{ user: string; amount: number }>;
	}): Promise<IExpense> {
		if (amount === null || amount === undefined || isNaN(amount)) {
			throw new ApiError(HTTP.status.BAD_REQUEST, "Invalid amount");
		}
		if (splits) {
			// check if the amount is distributed correctly
			const distributedAmounts = splits.reduce((acc, split) => {
				return acc + split.amount;
			}, 0);
			if (distributedAmounts !== amount) {
				throw new ApiError(
					HTTP.status.BAD_REQUEST,
					"Invalid split amounts"
				);
			}
			// check if the users exist
			const users = splits.map((split) => split.user);
			const foundMembers = await memberRepo.find({
				user: { $in: users },
			});
			if (!foundMembers) {
				throw new ApiError(HTTP.status.NOT_FOUND, "Members not found");
			}
			// check if everyone in the splits has some amount
			if (splits.some((split) => split.amount <= 0)) {
				throw new ApiError(
					HTTP.status.BAD_REQUEST,
					"Invalid split amounts"
				);
			}
		}
		const foundExpense = await ExpenseService.getExpenseById(expenseId);
		if (!foundExpense) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Expense not found");
		}
		// the user can only edit expense if it is paid by the user or is a personal expense
		if (foundExpense.author.id !== loggedInUserId) {
			throw new ApiError(HTTP.status.UNAUTHORIZED, "Unauthorized");
		}
		if (splits) {
			const existingSplits =
				(await splitRepo.find({
					expense: expenseId,
				})) || [];
			const splitsToCreate: Array<CreateModel<Split>> = splits
				.filter((split) => {
					const existingSplit = existingSplits.find(
						(s) => s.user.id === split.user
					);
					return !existingSplit;
				})
				.map((split) => ({
					expense: expenseId,
					user: split.user,
					pending:
						foundExpense.author.id === split.user
							? 0
							: split.amount,
					completed:
						foundExpense.author.id === split.user
							? split.amount
							: 0,
				}));
			const splitsToUpdate: Array<UpdateQuery<Split>> = splits
				.filter((split) => {
					const existingSplit = existingSplits.find(
						(s) => s.user.id === split.user
					);
					return existingSplit;
				})
				.map((split) => ({
					filter: {
						_id: existingSplits.find(
							(s) => s.user.id === split.user
						)!.id,
					},
					update: {
						$set: {
							pending:
								foundExpense.author.id === split.user
									? 0
									: split.amount,
							completed:
								foundExpense.author.id === split.user
									? split.amount
									: 0,
						},
					},
				}));
			const splitsToDelete: Array<string> = existingSplits
				.filter((split) => {
					const existingSplit = splits.find(
						(s) => s.user === split.user.id
					);
					return existingSplit === undefined;
				})
				.map((split) => split.id);
			await splitRepo.bulkCreate(splitsToCreate);
			await splitRepo.bulkUpdate(splitsToUpdate);
			await splitRepo.bulkRemove({ _id: { $in: splitsToDelete } });
		}
		if (group) {
			// check if the group exists
			const foundGroup = await groupRepo.findOne({ id: group });
			if (!foundGroup) {
				throw new ApiError(HTTP.status.NOT_FOUND, "Group not found");
			}
			// check if the user is a member of the group
			const members = await memberRepo.find({ group: foundGroup.id });
			if (!members) {
				throw new ApiError(HTTP.status.NOT_FOUND, "Group not found");
			}
			if (!members.some((member) => member.user.id === loggedInUserId)) {
				throw new ApiError(
					HTTP.status.UNAUTHORIZED,
					"You are not a member of this group"
				);
			}
			// check if the person who paid for this expense is a member of the group
			if (members.some((member) => member.user.id === author)) {
				throw new ApiError(
					HTTP.status.UNAUTHORIZED,
					"You are not a member of this group"
				);
			}
		}
		const updateExpenseBody: UpdateQuery<IExpense> = {
			$set: {
				title,
				amount,
				author,
				timestamp,
				group,
				tags,
				icon,
				type,
				method,
			},
		};
		const updatedExpense = await expenseRepo.update(
			{ id: expenseId },
			updateExpenseBody
		);
		if (!updatedExpense) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Expense not found");
		}
		return updatedExpense;
	}
	public static async deleteExpense({
		expenseId,
		loggedInUserId,
	}: {
		expenseId: string;
		loggedInUserId: string;
	}): Promise<boolean> {
		const foundExpense = await ExpenseService.getExpenseById(expenseId);
		if (!foundExpense) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Expense not found");
		}
		Logger.debug(
			foundExpense,
			loggedInUserId,
			typeof foundExpense.author.id,
			typeof loggedInUserId
		);
		// the user can only delete expense if it is paid by the user or is a personal expense
		if (foundExpense.author.id !== loggedInUserId) {
			throw new ApiError(HTTP.status.FORBIDDEN, "You cannot delete this");
		}
		// search for any splits for this expense
		await splitRepo.bulkRemove({ expense: expenseId });
		const expense = await expenseRepo.remove({ id: expenseId });
		Cache.del(Cache.getKey(cacheParameter.EXPENSE, { id: expenseId }));
		return expense !== null;
	}
}
