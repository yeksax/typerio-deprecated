import { prisma } from "../lib/prisma";

export async function appendGroupToUser(email: string, groupDisplayId: string) {
	const user = prisma.user.update({
		where: {
			email: email,
		},
		data: {
			groupChats: {
				connect: {
					displayId: groupDisplayId,
				},
			},
		},
		select: {
			groupChats: true,
		},
	});

	return user;
}
