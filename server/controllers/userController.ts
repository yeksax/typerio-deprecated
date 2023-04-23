import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import createUser from "../util/userCreate";
import { getUserGroups } from "../util/userGetGroups";

const userController = Router();

userController.post("/create", async (req: Request, res: Response) => {
	let user = req.body;
	const response = await createUser(user);
	res.send(response);
});

userController.get("/groups", async (req: Request, res: Response) => {
	const email = req.query.user as string;
	let result = await getUserGroups({user: {
		email: email
	}});
	
	res.send(result);
});

export default userController;
