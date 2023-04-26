import { prisma } from "../lib/prisma";

interface User {
	id?: string;
	name: string;
	email: string;
	image?: string;
}

export async function createUser({ name, email }: User) {
	try {
		const user = await prisma.user.create({
			data: {
				email: email,
				username: name,
			},
		});

		return user;
	} catch (error) {
		return error;
	}
}
