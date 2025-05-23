import { ApiRoute } from "@/server";
import { UserController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ GET: UserController.getUserFriends },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
