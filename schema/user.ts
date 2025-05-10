import { USER_ROLE } from "@/constants";

export const UserSchema = {
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		index: {
			unique: true,
			sparse: true,
		},
	},
	role: {
		type: String,
		enum: Object.values(USER_ROLE),
		default: USER_ROLE.MEMBER,
	},
};
