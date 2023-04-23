import { Request, Response, Router } from "express";
import { getGroups } from "../util/groupGet";
import { createGroup } from "../util/groupCreate";

const groupController = Router();

interface GroupChatBody {
	ownerEmail: string;
	group: {
		name: string;
		description: string;
		thumbnail: string;
	};
}

groupController.post("/create", async (req: Request, res: Response) => {
	let group = await createGroup(req);
	
	res.send(group);
});

groupController.get("/", async (req: Request, res: Response) => {
	let groups = await getGroups({
		user: {
			email: req.query.user as string,
		},
	});

	res.send(groups);
});

export default groupController;
