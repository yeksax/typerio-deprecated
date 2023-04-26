import { prisma } from "../lib/prisma";

export async function appendGroupToUser(email: string, groupId: string) {
	const user = await prisma.user.update({
		where: {
			email: email,
		},
		data: {
			groupChats: {
				connect: {
					id: groupId,
				},
			},
		},
		select: {
			groupChats: true,
		},
	});

	return groupId;
}
