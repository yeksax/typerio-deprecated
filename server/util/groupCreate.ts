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
	let id = await `${lowercase}-${await getRandomWord()}`;

	id = id.replace(/[/?%*:|"<>.;,+$#&^!@¨~\\°=(){}[\]]/g, "");

	let thumbnail = "/group.png";

	// @ts-ignore
	if (req.files != undefined) {
		// @ts-ignore
		let thumbnailFile = req.files.thumbnail;
		let ext = thumbnailFile.name.split(".").pop();

		thumbnail = `http://localhost:${process.env.PORT}/files/${id}/thumbnail.${ext}`;

		let thumbnailPath = path.join(
			process.cwd(),
			"files",
			id,
			`thumbnail.${ext}`
		);

		fs.mkdir(`${process.cwd()}/files/${id}`, (e) => {
			console.log(e);
		});

		thumbnailFile.mv(thumbnailPath);
	}

	let group = await prisma.group.create({
		data: {
			id: id,
			description: body.description,
			name: body.name,
			thumbnail: thumbnail,
			ownerId: owner.id,
			members: {
				connect: {
					id: owner.id,
				},
			},
		},
	});

	let udpdatedUser = await appendGroupToUser(owner.email, id);

	return { ...group, _count: { members: 1 }, isIn: true };
}
