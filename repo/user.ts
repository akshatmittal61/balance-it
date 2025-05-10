import { UserModel } from "../models";
import { IUser, User } from "../types";
import { BaseRepo } from "./base";

class UserRepo extends BaseRepo<User, IUser> {
	protected model = UserModel;
	public async findByEmail(email: string): Promise<IUser | null> {
		const res = await this.model.findOne({ email });
		return this.parser(res);
	}
}

export const userRepo = new UserRepo();
