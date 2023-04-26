import path from "path";
import fs from "fs";
import { prisma } from "../lib/prisma";

interface SetThumbnailArgs {
	id: string;
	thumbnail: string;
}

export async function setThumbnail({ id, thumbnail }: SetThumbnailArgs) {
	// @ts-ignore
	// @ts-ignore
	let ext = thumbnail.split(";")[0].split("/")[1];
	let file = thumbnail.split(";base64,").pop() as string;

	let thumbnailPath = `http://localhost:${process.env.PORT}/files/groups/${id}/thumbnail.png`;

	let filePath = path.join(
		process.cwd(),
		"files",
		"groups",
		id,
		`thumbnail.png`
	);

	fs.mkdir(`${process.cwd()}/files/groups/${id}`, (e) => {});

	await fs.writeFile(filePath, file, { encoding: "base64" }, (e) => {
		console.log(e);
	});

	const group = await prisma.group.update({
		where: {
			id: id,
		},
		data: {
			thumbnail: thumbnailPath,
		},
	});

  return group
}
