import { ExpenseModel } from "@/models";
import { Expense, IExpense, ObjectId } from "@/types";
import { BaseRepo } from "./base";

class WalletRepo extends BaseRepo<Expense, IExpense> {
	model = ExpenseModel;
	public async getFilterOptions(userId: string) {
		// Filter Options
		// - Price Range (Give max and min expenditure)
		// - Date Range (Give dates for first and last expense)
		// - Category (Give tags used in expenses)
		// - Type (Paid, Received, Self)
		// - Method (Cash, Card, UPI, Netbanking)

		const userFilter = { $match: { author: new ObjectId(userId) } };

		const [priceRange, dateRange, tags, types, methods] = await Promise.all(
			[
				this.model.aggregate([
					userFilter,
					{
						$group: {
							_id: null,
							min: { $min: "$amount" },
							max: { $max: "$amount" },
						},
					},
					{ $project: { _id: 0, min: 1, max: 1 } },
				]),
				this.model.aggregate([
					userFilter,
					{
						$group: {
							_id: null,
							begin: { $min: "$timestamp" },
							end: { $max: "$timestamp" },
						},
					},
					{ $project: { _id: 0, begin: 1, end: 1 } },
				]),
				this.model.aggregate([
					userFilter,
					{ $unwind: "$tags" },
					{
						$group: {
							_id: "$tags",
							count: { $sum: 1 },
						},
					},
					{ $project: { _id: 0, tag: "$_id", count: 1 } },
				]),
				this.model.aggregate([
					userFilter,
					{
						$group: {
							_id: "$type",
							count: { $sum: 1 },
						},
					},
					{ $project: { _id: 0, type: "$_id", count: 1 } },
				]),
				this.model.aggregate([
					userFilter,
					{
						$group: {
							_id: "$method",
							count: { $sum: 1 },
						},
					},
					{ $project: { _id: 0, method: "$_id", count: 1 } },
				]),
			]
		);

		return {
			amount: priceRange[0],
			timestamp: dateRange[0],
			tags,
			types,
			methods,
		};
	}
}

export const walletRepo = WalletRepo.getInstance<WalletRepo>();
