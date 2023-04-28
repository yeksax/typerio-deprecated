import path from "path";
import fs from "fs";
import { prisma } from "../lib/prisma";

interface SetThumbnailArgs {
	id: string;
	thumbnail: string;
}

export async function setThumbnail({ id, thumbnail }: SetThumbnailArgs) {
	let file = thumbnail.split(";base64,").pop() as string;
	let filePath = path.join(
		process.cwd(),
		"files",
		"groups",
		id,
		`thumbnail.png`
	);


  let thumbnailPath = `http://localhost:${process.env.PORT}/files/groups/${id}/thumbnail.png`;

	fs.mkdir(`${process.cwd()}/files/groups/${id}`, (e) => {});

	await fs.writeFile(filePath, file, { encoding: "base64" }, (e) => {
	});

	const group = await prisma.group.update({
		where: {
			id: id,
		},
		data: {
			thumbnail: thumbnailPath,
		},
	});

  return group.thumbnail
}
