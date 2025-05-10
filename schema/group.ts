import { fallbackAssets } from "@/constants";
import mongoose from "mongoose";

export const GroupSchema = {
	name: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
		default: fallbackAssets.groupIcon,
	},
	banner: {
		type: String,
		default: fallbackAssets.banner,
	},
	tags: {
		type: [String],
		required: false,
		default: [],
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
};
