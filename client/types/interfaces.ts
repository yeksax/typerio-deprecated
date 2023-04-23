interface groupChat {
	id?: string;
	ownerId?: string;
	name?: string;
	description?: string;
	thumbnail?: string;
	createdAt?: Date;
	isIn: boolean;
	displayId: string;

	_count?: {
		members: Number;
	};
}
[];
