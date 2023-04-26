interface Group {
	id: string;
	ownerId: string;
	name: string;
	description: string;
	thumbnail: string;
	createdAt: Date;
	isIn: boolean;
	displayId: string;

	_count: {
		members: Number;
	};
}
[];

interface Message {
	id: 2;
	createdAt: Date;
	updatedAt: Date;
	content: string;
	pastVersions: Message[];
	authorId: string;
	groupChatId: string;
	author: {
		username: string;
		profilePicture: string;
	};
	isAuthor: true;
}

interface User {
	username: string;
	profilePicture: string;
	isMe: boolean;
}
