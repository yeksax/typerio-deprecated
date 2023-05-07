import { Message, User } from "@prisma/client";
import { prisma } from "../lib/prisma";

import path = require("path");
import fs = require("fs");
import { File } from "buffer";
import { Socket } from "socket.io";

interface NewMessage {
	message: {
		content: string;
		mention: string;
	};
	attachments: {
		files: string[];
		filesData: {
			name: string;
			size: number;
			originalName?: string;
		}[];
	};
	author: { email: string };
	group: { id: string };
}

export async function messageHandler(data: NewMessage, author: string, socket: Socket) {
	let newMessage = await prisma.message.create({
		data: {
			authorId: author,
			groupChatId: data.group.id,
			content: data.message.content,
			mentionedMessageId: data.message.mention,
		},
		include: {
			attachments: true,
			author: {
				select: {
					username: true,
					profilePicture: true,
					name: true,
					tag: true,
				},
			},
			mentionedMessage: {
				include: {
					author: true,
				},
			},
		},
	});

	var files: NewMessage["attachments"]["filesData"] = [];

	if (data.attachments.files.length > 0) {
		const filePath = path.join(
			process.cwd(),
			"files",
			"messages",
			newMessage.id
		);

		fs.mkdir(filePath, async (e) => {
			if (e) {
				return;
			}
		});

		for (let i = 0; i < data.attachments.files.length; i++) {
			let file = data.attachments.files[i];
			let fileData = data.attachments.filesData[i];
			let fileExt = fileData.name.split(".").pop();

			fileData.originalName = fileData.name;

			let similarFiles = 0;

			for (let file of files) {
				if (file.originalName == fileData.originalName) {
					similarFiles++;
				}
			}

			if (similarFiles > 0) {
				let newFileName = `${fileData.originalName
					.split(".")
					.slice(0, -1)
					.join(".")} (${similarFiles})`;

				fileData.name = `${newFileName}.${fileExt}`;
			}

			files.push(fileData);

			fs.writeFile(
				path.join(filePath, fileData.name),
				Buffer.from(file),
				(e) => {}
			);
		}

		const serverFilePath = path.join(
			"localhost:3001",
			"files",
			"messages",
			newMessage.id
		);

		return await prisma.message.update({
			where: {
				id: newMessage.id,
			},
			data: {
				attachments: {
					createMany: {
						data: [
							...files.map((file) => {
								return {
									name: file.name,
									size: file.size,
									url:
										"http://" +
										path.join(serverFilePath, file.name),
								};
							}),
						],
					},
				},
			},
			include: {
				author: {
					select: {
						username: true,
						profilePicture: true,
						name: true,
						tag: true,
					},
				},
				mentionedMessage: {
					include: {
						author: true,
					},
				},
				attachments: true,
			},
		});
	} else {
		return newMessage;
	}
}
