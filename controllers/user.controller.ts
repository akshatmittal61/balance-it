import { UserService } from "@/services";
import { ApiRequest, ApiResponse, IUser, UpdateUser } from "@/types";
import {
	ApiFailure,
	ApiSuccess,
	genericParse,
	getNonEmptyString,
	getNonNullValue,
	getString,
	safeParse,
} from "@/utils";

export class UserController {
	public static async updateUserProfile(req: ApiRequest, res: ApiResponse) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const name = safeParse(getString, req.body.name);
		const phone = safeParse(getString, req.body.phone);
		const avatar = safeParse(getString, req.body.avatar);
		const body: UpdateUser = {};
		if (name !== null) body["name"] = name;
		if (phone != null) body["phone"] = phone;
		if (avatar !== null) body["avatar"] = avatar;
		if (Object.keys(body).length === 0) {
			return new ApiFailure(res).send(
				"Please provide at least one field to update"
			);
		}
		const user = await UserService.updateUserProfile(userId, body);
		return new ApiSuccess<IUser>(res).send(user);
	}
	public static async inviteUser(req: ApiRequest, res: ApiResponse) {
		const loggedInUserId = genericParse<string>(
			getNonEmptyString,
			req.user?.id
		);
		const invitee = genericParse<string>(getNonEmptyString, req.body.email);
		const invitedUser = await UserService.inviteUser(
			loggedInUserId,
			invitee
		);
		return new ApiSuccess(res).send(invitedUser);
	}

	public static async searchForUsers(req: ApiRequest, res: ApiResponse) {
		const query = genericParse(getNonEmptyString, req.body.query);
		const users = await UserService.searchByEmail(query);
		return new ApiSuccess(res).send(users);
	}
	public static async searchInBulk(req: ApiRequest, res: ApiResponse) {
		const query = genericParse(getNonEmptyString, req.body.query);
		const invitee = getNonNullValue(req.user);
		const users = await UserService.searchInBulk(query, invitee);
		return new ApiSuccess(res).send(users);
	}
	public static async getUserFriends(req: ApiRequest, res: ApiResponse) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const friends = await UserService.getFriendsForUser(userId);
		return new ApiSuccess(res).send(friends);
	}
}
