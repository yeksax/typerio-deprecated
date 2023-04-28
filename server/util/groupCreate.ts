import { prisma } from "../lib/prisma";
import { appendGroupToUser } from "./userJoinGroup";
import { removeAccents, removeBadCharacteres, removeEmojis } from "./_stringCleaning";
import axios from "axios";

interface CreateGroupBody {
	owner: string;
	name: string;
	description: string;
}

export async function createGroup(body: CreateGroupBody) {
	const owner = (await prisma.user.findUnique({
		where: {
			email: body.owner,
		},
		select: {
			id: true,
			email: true,
		},
	})) as any;

	const getRandomWord = async () => {
		return await (
			await axios.get("https://random-word-api.herokuapp.com/word")
		).data;
	};

	const lowercase = body.name.toLowerCase().replace(/ /g, "-");
	let id = await `${lowercase}-${await getRandomWord()}`;

	id = removeBadCharacteres(id)
	id = removeAccents(id);
	id = removeEmojis(id);

	let group = await prisma.group.create({
		data: {
			id: id,
			description: body.description,
			name: body.name,
			ownerId: owner.id,
			members: {
				connect: {
					id: owner.id,
				},
			},
		},
	});

	let udpdatedUser = await appendGroupToUser(owner.email, id);

	return { ...group, _count: { members: 1 }, isIn: true };
}
