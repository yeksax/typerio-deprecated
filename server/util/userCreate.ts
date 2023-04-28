import { prisma } from "../lib/prisma";

interface User {
	id?: string;
	name: string;
	email: string;
	image?: string;
}

function padWithLeadingZeros(num: number, totalLength: number) {
	return String(num).padStart(totalLength, "0");
}

export async function createUser({ name, email }: User) {
	const tag = padWithLeadingZeros(Math.floor(Math.random() * 9999), 4);

	try {
		const user = await prisma.user.create({
			data: {
				email: email,
				tag: tag,
				name: name,
				username: `${name.toLowerCase().replace(/\s/g, '-')}_${tag}`,
			},
		});

		return user;
	} catch (error) {
		return error;
	}
}
