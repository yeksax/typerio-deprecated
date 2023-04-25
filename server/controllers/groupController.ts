import { Request, Response, Router } from "express";
import { getGroup, getGroups } from "../util/groupGet";
import { createGroup } from "../util/groupCreate";
import { appendGroupToUser } from "../util/userJoinGroup";
import { getGroupMembers } from "../util/groupGetMembers";

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

interface group {
	user: string;
	group: string;
}

groupController.post("/:group/join", async (req: Request, res: Response) => {
	let data: group = req.body;
	await appendGroupToUser(data.user, data.group);

	res.sendStatus(200);
});

groupController.get("/", async (req: Request, res: Response) => {
	let groups = await getGroups({
		user: {
			email: req.query.user as string,
		},
	});

	res.send(groups);
});

groupController.get("/:group", async (req: Request, res: Response) => {
	let group = await getGroup(req.params.group);

	res.send(group);
});

groupController.get("/:group/members", async (req: Request, res: Response) => {
	let group = await getGroupMembers(req.params.group);

	res.send(group);
});

export default groupController;
