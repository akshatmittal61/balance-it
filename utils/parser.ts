import { fallbackAssets } from "@/constants";
import { IUser } from "@/types";

export const getObjectFromMongoResponse = <T>(response: any): T | null => {
	if (response === null || response === undefined) {
		return null;
	}
	const object = response.toObject ? response.toObject() : response;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { _id, id, __v, createdAt, updatedAt, ...rest } = object;
	const entityId = (_id ?? id).toString();
	const data = {
		...rest,
		id: entityId,
	};
	if (createdAt) {
		data.createdAt = new Date(createdAt).toISOString();
	}
	if (updatedAt) {
		data.updatedAt = new Date(updatedAt).toISOString();
	}
	return data;
};

export const getUserDetails = (user: IUser): IUser => {
	const name = user.name || user.email.split("@")[0];
	return {
		...user,
		avatar:
			user.avatar ||
			`https://ui-avatars.com/api/?name=${name}&background=random`,
		name,
	};
};
