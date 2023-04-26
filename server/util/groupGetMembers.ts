import { prisma } from "../lib/prisma";

export async function getGroupMembers(groupId: string, email: string) {
	let res = await prisma.group.findUnique({
		where: {
			id: groupId,
		},
		select: {
			members: {
				select: {
					username: true,
					profilePicture: true,
					email: true,
				},
			},
		},
	});

	let members: any[] = [];

	res?.members.forEach((member) => {
		members.push({
			username: member.username,
			profilePicture: member.profilePicture,
			isMe: member.email == email,
		});
	});

	members.sort((a, b) => {
		if (a.isMe) return -1;
		if (b.isMe) return 1;
		return 0;
	});

	return members;
}
