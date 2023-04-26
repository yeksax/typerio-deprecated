import { Group } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { group } from "console";

interface GroupResponse extends Group {
	isIn?: boolean;
}

export async function getUserGroups(email: string) {
	let groups: Group[] | undefined = [];

	let user = await prisma.user.findUnique({
		where: {
			email: email,
		},
		include: {
			groupChats: {
				include: {
					_count: {
						select: {
							members: true,
						},
					},
				},
			},
		},
	});

	groups = user?.groupChats;
	groups = groups?.sort((a, b) => (a.ownerId == user?.id ? -1 : 1));

	return groups?.map((group) => {
		return { ...group, isIn: true };
	});
}
