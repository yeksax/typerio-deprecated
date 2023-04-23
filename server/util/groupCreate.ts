import { prisma } from "../lib/prisma";
import axios from "axios";
import { appendGroupToUser } from "./userJoinGroup";
import { Request } from "express";

import path from "path";
import fs from "fs";

interface CreateGroupBody {
	owner: string;
	name: string;
	description: string;
}

export async function createGroup(req: Request) {
	const body: CreateGroupBody = await req.body;

	const owner = await prisma.user.findUnique({
		where: {
			email: body.owner,
		},
		select: {
			id: true,
			email: true,
		},
	});

	if (!owner) return "owner not found";

	const getRandomWord = async () => {
		return await (
			await axios.get("https://random-word-api.herokuapp.com/word")
		).data;
	};

	const lowercase = body.name.toLowerCase().replace(/ /g, "-");
	let displayId = await `${lowercase}-${await getRandomWord()}`;

	let thumbnail = "/group.png";

	// @ts-ignore
	if (req.files != undefined) {
		// @ts-ignore
		let thumbnailFile = req.files.thumbnail;
		let ext = thumbnailFile.name.split(".").pop();

		thumbnail = `http://localhost:${process.env.PORT}/files/${displayId}/thumbnail.${ext}`;

		let thumbnailPath = path.join(
			process.cwd(),
			"files",
			displayId,
			`thumbnail.${ext}`
		);

		fs.mkdir(`${process.cwd()}/files/${displayId}`, (e) => {
			console.log(e);
		});

		thumbnailFile.mv(thumbnailPath);
	}

	let group = await prisma.group.create({
		data: {
			description: body.description,
			name: body.name,
			thumbnail: thumbnail,
			ownerId: owner.id,
			displayId: displayId,
			members: {
				connect: {
					id: owner.id,
				},
			},
		},
	});

	let udpdatedUser = await appendGroupToUser(owner.email, displayId);

	return { ...group, _count: { members: 1 }, isIn: true };
}
