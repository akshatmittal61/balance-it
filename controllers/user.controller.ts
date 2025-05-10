import { UserService } from "@/services";
import { ApiRequest, ApiResponse } from "@/types";
import { ApiSuccess, genericParse, getNonEmptyString } from "@/utils";

export class UserController {
	public static async hello(_: ApiRequest, res: ApiResponse) {
		const data = { name: "Name is Bond! James Bond!" };
		return new ApiSuccess<typeof data>(res).send(data);
	}
	public static async getUserByEmail(req: ApiRequest, res: ApiResponse) {
		const email = genericParse(getNonEmptyString, req.query.email);
		const user = await UserService.getUserByEmail(email);
		return new ApiSuccess(res).send(user);
	}
}
