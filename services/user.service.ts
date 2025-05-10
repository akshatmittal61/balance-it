import { userRepo } from "@/repo";
import { CreateModel, IUser, User } from "@/types";
import { genericParse, getNonEmptyString } from "@/utils";

export class UserService {
	public static async getUserByEmail(email: string) {
		return await userRepo.findByEmail(email);
	}
	public static async findOrCreateUser(
		body: CreateModel<User>
	): Promise<{ user: IUser; isNew: boolean }> {
		const email = genericParse(getNonEmptyString, body.email);
		const foundUser = await userRepo.findByEmail(email);
		if (foundUser) {
			return { user: foundUser, isNew: false };
		}
		const createdUser = await userRepo.create(body);
		return { user: createdUser, isNew: true };
	}
}
