import { prisma } from "../lib/prisma";

export async function getGroupMessages(groupId: string, email: string) {
	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
		select: {
			id: true,
		},
	});

	let group = await prisma.group.findUnique({
		where: {
			id: groupId,
		},
		select: {
			messages: {
				include: {
					author: {
						select: {
							username: true,
							profilePicture: true,
							name: true,
							tag: true
						},
					},
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	let messages: any[] = [];

	group?.messages.forEach((message) => {
		messages.push({ ...message, isAuthor: message.authorId === user?.id });
	});

	return messages;
}
