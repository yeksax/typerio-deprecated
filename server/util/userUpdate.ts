import path from "path";
import fs from "fs";

import { prisma } from "../lib/prisma";
import { removeAccents } from "./_stringCleaning";

export async function updateUser(
	id: string,
	data: { name: string; tag: string }
) {
	const username = `${removeAccents(data.name)
		.toLowerCase()
		.replace(/\s/g, "-")}_${data.tag}`;

	const user = await prisma.user.update({
		where: {
			id: id,
		},
		data: { ...data, username: username },
	});

	return user;
}

interface SetAvatarArgs {
	id: string;
	avatar: string;
}

export async function updateUserAvatar({ id, avatar }: SetAvatarArgs) {
	let file = avatar.split(";base64,").pop() as string;
	let filePath = path.join(process.cwd(), "files", "users", id, `avatar.png`);

	let profilePicture = `http://localhost:${process.env.PORT}/files/users/${id}/avatar.png`;

	fs.mkdir(`${process.cwd()}/files/users/${id}`, (e) => {});

	await fs.writeFile(filePath, file, { encoding: "base64" }, (e) => {
  });

	const user = await prisma.user.update({
		where: {
			id: id,
		},
		data: {
			profilePicture: profilePicture,
		},
	});

	return user.profilePicture;
}
