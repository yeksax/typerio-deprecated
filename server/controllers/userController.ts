import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const userController = Router();

userController.get("/", async (req: Request, res: Response) => {
	res.send("userpage");
});

userController.get("/login", (req: Request, res: Response) => {
	console.log("login");
	res.sendStatus(200);
});

userController.get("/groups", async (req: Request, res: Response) => {
	const email = req.query.email as string;

	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
		include: {
			groupChats: {
				include: {
					_count: {
						select: {
							members: true,
						},
					},
				},
			},
		},
	});

	let groupChats = user?.groupChats.map((group) => {
		return { ...group, isIn: true };
	});

	if (groupChats == undefined) groupChats = [];
	res.send(groupChats);
});

export default userController;
