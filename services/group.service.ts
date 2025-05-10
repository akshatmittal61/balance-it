import { Cache } from "@/cache";
import { cacheParameter } from "@/constants";
import { groupRepo } from "@/repo";
import { IGroup } from "@/types";

export class GroupService {
	public static async getGroupById(id: string): Promise<IGroup | null> {
		const cacheKey = Cache.getKey(cacheParameter.GROUP, { id });
		return await Cache.fetch(cacheKey, () => groupRepo.findById(id));
	}
	public static async getAllGroupsForUser(
		userId: string
	): Promise<Array<IGroup>> {
		const groups = await Cache.fetch(
			Cache.getKey(cacheParameter.USER_GROUPS, { userId }),
			() => groupRepo.find({ members: { $in: [userId] } })
		);
		if (!groups) return [];
		return groups;
	}
}
