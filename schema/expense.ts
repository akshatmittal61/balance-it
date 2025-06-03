import { EXPENSE_METHOD, EXPENSE_TYPE } from "@/constants";
import mongoose from "mongoose";

export const ExpenseSchema = {
	title: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	timestamp: {
		type: Date,
	},
	description: {
		type: String,
	},
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Group",
		required: false,
	},
	tags: {
		type: [
			{
				type: String,
				trim: true,
				lowercase: true,
				validate: {
					validator: (tag: string) => tag.length > 0,
					message: "Tag cannot be empty",
				},
			},
		],
		required: false,
		default: [],
	},
	icon: {
		type: String,
		required: false,
	},
	type: {
		type: String,
		enum: Object.values(EXPENSE_TYPE),
		default: EXPENSE_TYPE.PAID,
	},
	method: {
		type: String,
		enum: Object.values(EXPENSE_METHOD),
		default: EXPENSE_METHOD.UPI,
		required: false,
	},
};
