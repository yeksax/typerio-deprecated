import { prisma } from "../lib/prisma";

export async function getGroupMembers(groupId: string) {
	return await prisma.group.findUnique({
		where: {
			id: groupId,
		},
		select: {
			members: {
        select: {
          username: true,
          profilePicture: true,
        }
      },
		},
	});
}
