import { prisma } from "../lib/prisma";
import axios from "axios";
import { appendGroupToUser } from "./userJoinGroup";

interface CreateGroupBody {
	owner: string;
	group: {
		name: string;
		description: string;
		thumbnail: string;
	};
}

export async function createGroup(body: CreateGroupBody) {
	const owner = await prisma.user.findUnique({
		where: {
			email: body.owner,
		},
		select: {
			id: true,
			email: true,
		},
	});

	if (!owner) return "owner not found";

	const getRandomWord = async () => {
		return await (
			await axios.get("https://random-word-api.herokuapp.com/word")
		).data;
	};

	const lowercase = body.group.name.toLowerCase().replace(/ /g, "-");
	let displayId = await `${lowercase}-${await getRandomWord()}`;

	const group = await prisma.group.create({
		data: {
			description: body.group.description,
			name: body.group.name,
			thumbnail: body.group.thumbnail,
			ownerId: owner.id,
			displayId: displayId,
			members: {
				connect: {
					id: owner.id,
				},
			},
		},
	});

	let udpdatedUser = await appendGroupToUser(owner.email, displayId);
	console.log(udpdatedUser)

	return group;
}
