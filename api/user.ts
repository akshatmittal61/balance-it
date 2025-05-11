import { http } from "@/connections";
import { ApiRes, Friend, IUser } from "@/types";

export class UserApi {
	public static async updateUser(
		data: Partial<IUser>
	): Promise<ApiRes<IUser>> {
		const response = await http.patch("/profile", data);
		return response.data;
	}
	public static async searchForUsers(
		query: string
	): Promise<ApiRes<Array<IUser>>> {
		const response = await http.post("/users/search", { query });
		return response.data;
	}
	public static async inviteUser(email: string): Promise<ApiRes<IUser>> {
		const response = await http.post("/users/invite", { email });
		return response.data;
	}
	public static async searchInBulk(query: string): Promise<
		ApiRes<{
			users: Array<IUser>;
			message: string;
		}>
	> {
		const response = await http.post("/users/search/bulk", { query });
		return response.data;
	}
	public static async getUserFriends(
		headers?: any
	): Promise<ApiRes<Array<Friend>>> {
		const response = await http.get("/users/friends", { headers });
		return response.data;
	}
}
