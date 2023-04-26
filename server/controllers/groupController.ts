import { Request, Response, Router } from "express";
import { getGroup, getGroups } from "../util/groupGet";
import { createGroup } from "../util/groupCreate";

const groupController = Router();

groupController.post("/create", async (req: Request, res: Response) => {
	console.log('oi')
	let group = await createGroup(req);

	res.send(group);
});

interface group {
	user: string;
	group: string;
}

export default groupController;
