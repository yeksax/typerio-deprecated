import { Request, Response, Router } from "express";
import { Group, Message, PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { getGroups } from "../util/groupGet";
import { createGroup } from "../util/groupCreate";

const groupChatController = Router();

interface GroupChatBody {
	ownerEmail: string;
	group: {
		name: string;
		description: string;
		thumbnail: string;
	};
}

groupChatController.post("/create", async (req: Request, res: Response) => {
	let group = await createGroup(req.body);
	res.send(group);
});

groupChatController.get("/", async (req: Request, res: Response) => {
	let groups = await getGroups({
		user: {
			email: req.query.user as string,
		},
	});

	res.send(groups);
});

export default groupChatController;
