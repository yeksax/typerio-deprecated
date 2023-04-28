import { Group } from "@prisma/client";
import { prisma } from "../lib/prisma";

interface GroupResponse extends Group {
	isIn?: boolean;
}

export async function getGroups(email?: string) {
	let groups: GroupResponse[] = [];
	let userGroups: Group["id"][] | undefined | null = [];

	groups = await prisma.group.findMany({
		include: {
			_count: {
				select: {
					members: true,
				},
			},
		},
	});

	if (email) {
		userGroups = await prisma.user
			.findUnique({
				where: {
					email: email,
				},
				select: {
					groupChats: true,
				},
			})
			.groupChats({ select: { id: true } })
			// mapping user groups to ids only
			.then((uGroups) => uGroups?.map((group) => group.id));

		groups.map((group) => {
			if (userGroups?.includes(group.id)) {
				return (group.isIn = true);
			}
		});
	}

	groups.sort((a, b) => (a.isIn ? -1 : 1));

	return groups;
}

export async function getGroup(groupId: string) {
	return await prisma.group.findUnique({
		where: {
			id: groupId,
		},
		include: {
			_count: {
				select: {
					members: true,
				},
			},
		},
	});
}
