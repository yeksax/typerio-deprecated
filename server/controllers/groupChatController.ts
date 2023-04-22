import { Request, Response, Router } from "express";
import { GroupChat, Message, PrismaClient } from "@prisma/client";

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
	let groupInfo: GroupChatBody = req.body;
	const prisma = new PrismaClient();

	const owner = await prisma.user.findUnique({
		where: { email: groupInfo.ownerEmail },
		include: { ownedGroupChats: true, groupChats: true },
	});

	if (!owner) return res.status(400).send("Owner not found");

	const groupChat = await prisma.groupChat.create({
		data: {
			...groupInfo.group,
			ownerId: owner?.id,
			members: {
				connect: {
					id: owner?.id,
				},
			},
		},
		include: {
			members: true,
		},
	});

	let groupChats: any[] = owner?.groupChats;
	groupChats?.push(groupChat);
	groupChats = groupChats.map((group) => {
		return {
			id: group.id,
		};
	});

	const updatedUser = await prisma.user.update({
		where: { id: owner?.id },
		data: {
			groupChats: { set: groupChats },
		},
		include: {
			groupChats: true,
		},
	});

	res.status(200).send("Group created");
});

groupChatController.get("/", async (req: Request, res: Response) => {
	const prisma = new PrismaClient();
	let groupChats: GroupChat[] = [];
	let userEmail = req.query.user as string;

	groupChats = await prisma.groupChat.findMany({
		include: {
			_count: {
				select: {
					members: true,
				},
			},
		},
	});

	let isIn: boolean;

	const user = await prisma.user.findUnique({
		where: {
			email: userEmail,
		},
		include: { groupChats: true },
	});

	let mappedGroupChats: any[] = [];

	groupChats.forEach((group) => {
		let currentGroup;
		let isIn = false;

		let userGroups = user?.groupChats.map((group) => {
			return group.id;
		});

		isIn = userGroups?.includes(group.id) as boolean;

		currentGroup = {
			...group,
			isIn: isIn,
		};

		mappedGroupChats.push(currentGroup);
	});

	await prisma.$disconnect();
	res.send(mappedGroupChats);
});

export default groupChatController;
