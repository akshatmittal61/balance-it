import { http } from "@/connections";
import { ApiRequests, ApiRes, ApiResponses, IUser } from "@/types";

export class UserApi {
	public static async updateUser(data: Partial<IUser>) {
		const response = await http.patch<
			ApiRes<ApiResponses.UpdateUser>,
			ApiRequests.UpdateUser
		>("/profile", data);
		return response.data;
	}
	public static async searchForUsers(
		query: string
	): Promise<ApiRes<Array<IUser>>> {
		const response = await http.post<
			ApiRes<ApiResponses.SearchUsers>,
			ApiRequests.SearchUsers
		>("/users/search", { query });
		return response.data;
	}
	public static async inviteUser(email: string) {
		const response = await http.post<
			ApiRes<ApiResponses.InviteUser>,
			ApiRequests.InviteUser
		>("/users/invite", { email });
		return response.data;
	}
	public static async searchInBulk(query: string) {
		const response = await http.post<
			ApiRes<ApiResponses.BulkUserSearch>,
			ApiRequests.BulkUserSearch
		>("/users/search/bulk", { query });
		return response.data;
	}
	public static async getUserFriends(headers?: any) {
		const response = await http.get<
			ApiRes<ApiResponses.GetUserFriends>,
			ApiRequests.GetUserFriends
		>("/users/friends", { headers });
		return response.data;
	}
}
