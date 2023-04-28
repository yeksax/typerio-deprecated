import type {
	Group as group,
	Message as message,
	User as user,
} from "../../server/lib/prisma";

export interface Group extends group {
	messages?: Message[];
	members?: User[];
	isIn?: boolean;

	_count?: {
		members: Number;
	};
}

export interface Message extends message {
	isAuthor: boolean;
	author: User;
}
export interface User extends user {
	isMe?: boolean;
	status?: string;
}
