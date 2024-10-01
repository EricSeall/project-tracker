export interface Project {
	_id: string;

	ownerId: string;

	title: string;

	// project priority level [0 - low, 1 - med, 2 - high]
	priority: number;

	streamLink: string;

	dueDate: string;

	description: string;

	// array of to-dos for project
	checklist: [ListItem];

	createdAt: string;
	updatedAt: string;
}
export interface ListItem {
	_id?: string;
	content: string;
	isCompleted: boolean;
	createdAt?: string;
	updatedAt?: string;
}
