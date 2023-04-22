import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

const userController = Router();

userController.get("/", async (req: Request, res: Response) => {
	res.send("userpage");
});

userController.get("/groups", async (req: Request, res: Response) => {
	const prisma = new PrismaClient();
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
