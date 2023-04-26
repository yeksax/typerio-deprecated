import type {
	Group as group,
	Message as message,
	User as user,
} from "../../server/lib/prisma";

export interface Group extends group {
	messages: Message[];
	members: User[];

	_count?: {
		members: Number;
	};
}

export interface Message extends message {}
export interface User extends user {}
