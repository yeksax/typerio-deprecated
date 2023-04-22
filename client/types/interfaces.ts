interface groupChat {
	id?: string;
	ownerId?: string;
	name?: string;
	description?: string;
	thumbnail?: string;
	createdAt?: Date;
	isIn: boolean;

	_count?: {
		members: Number;
	};
}
[];
