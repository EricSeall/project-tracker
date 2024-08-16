const mongoose = require("mongoose");
const projectModel = require("../models/projectModel");

// '/' GET
const getProjects = async (req, res) => {
	const projects = await projectModel.find({}).sort({ createdAt: -1 });
	res.status(200).json(projects);
};

// '/:id' GET
const getProject = async (req, res) => {
	const project = await projectModel.findById(req.params.id);
	res.status(200).json(project);
};

// '/' POST
const createProject = async (req, res) => {
	const { title, priority, streamLink, dueDate, description } = req.body;

	// input validation
	let emptyFields = [];

	if (!title) {
		emptyFields.push("title");
	}
	if (!priority) {
		emptyFields.push("load");
	}
	if (emptyFields.length > 0) {
		res
			.status(400)
			.json({ error: "Please fill in all required fields", emptyFields });
	}
	// model creation
	try {
		const project = await projectModel.create({
			title,
			priority,
			streamLink,
			dueDate,
			description,
		});
		res.status(200).json(project);
	} catch (error) {}
};

// '/:id' PATCH
const updateProject = async (req, res) => {
	const { id } = req.params;

	// check if 'id' is a valid id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Project not found" });
	}

	// handle empty requests (to avoid setting everything to undefined in that case)
	const updatedFields = {};
	if (req.body.title) updatedFields.title = req.body.title;
	if (req.body.priority) updatedFields.priority = req.body.priority;
	if (req.body.streamLink) updatedFields.streamLink = req.body.streamLink;
	if (req.body.dueDate) updatedFields.dueDate = req.body.dueDate;
	if (req.body.description) updatedFields.description = req.body.description;
	if (req.body.checklist) updatedFields.checklist = req.body.checklist;

	// update model
	const project = await projectModel.findOneAndUpdate(
		{ _id: id },
		{ ...updatedFields },
		{ new: true }
	);

	if (!project) {
		return res.status(400).json({ error: "Project not found" });
	}
	res.status(200).json(project);
};

// '/:id' DELETE
const deleteProject = async (req, res) => {
	const { id } = req.params;
	// check if 'id' is a valid id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Project not found" });
	}

	// delete project
	const project = await projectModel.findOneAndDelete({ _id: id });

	if (!project) {
		return res.status(400).json({ error: "Project not found" });
	}
	res.status(200).json(project);
};

module.exports = {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
};
