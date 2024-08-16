const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
	{
		// project wip name
		title: {
			type: String,
			required: true,
		},

		// project priority level [0 - low, 1 - med, 2 - high]
		priority: {
			type: Number,
			required: true,
		},

		// streaming link to project WIP
		streamLink: String,

		// project's due date
		dueDate: Date,

		description: String,

		// array of to-dos for project
		checklist: [
			{
				content: String,
				completed: Boolean,
				stage: String,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
