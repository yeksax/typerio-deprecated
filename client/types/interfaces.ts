import type {
	Group as group,
	Message as message,
	User as user,
	File as file,
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
	mentionedMessage: Message;
	attachments: File[];
}

export interface User extends user {
	isMe?: boolean;
	status?: { title: string; data?: any };
}

export interface File extends file {}

export interface WaitingMessageProps {
	content: string;
	attachments: FileData[];
}

interface FileData {
  name: string,
  size: number
  id: string,
  deleted: boolean
}