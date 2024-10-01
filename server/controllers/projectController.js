const mongoose = require("mongoose");
const projectModel = require("../models/projectModel");

// '/' GET
const getProjects = async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

	if (!req.user) {
		return res.status(403).json({ error: "User not logged in" });
	}

	const projects = await projectModel
		.find({ ownerId: req.user })
		.sort({ createdAt: -1 });

	if (!projects) {
		return res.status(404).json({ error: "Projects not found" });
	}
	res.status(200).json(projects);
};

// '/:id' GET
const getProject = async (req, res) => {
	const { id } = req.params;

	if (!req.user) {
		return res.status(403).json({ error: "User not logged in" });
	}

	res.setHeader("Access-Control-Allow-Credentials", "true");
	// check if 'id' is a valid id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: "Invalid ID Format" });
	}

	const project = await projectModel.findById(req.params.id);

	if (project.ownerId != req.user) {
		return res.status(403).json({ error: "Access Denied" });
	}

	// if no project found
	if (!project) {
		return res.status(404).json({ error: "Project not found" });
	}

	res.status(200).json(project);
};

// '/' POST
const createProject = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({ error: "User not logged in" });
	}

	const { title, priority, streamLink, dueDate, description, checklist } =
		req.body;

	res.setHeader("Access-Control-Allow-Credentials", "true");
	// input validation
	let emptyFields = [];

	if (!title) {
		emptyFields.push("title");
	}
	if (!priority) {
		emptyFields.push("priority");
	}
	if (emptyFields.length > 0) {
		return res.status(400).json({
			error: `Please fill in all required fields: ${emptyFields.join(", ")}`,
		});
	}
	// model creation
	try {
		const project = await projectModel.create({
			ownerId: req.user,
			title,
			priority,
			streamLink,
			dueDate,
			description,
			checklist,
		});

		res.status(200).json(project);
	} catch (error) {
		return res.status(400).json({ error: "Error creating project" });
	}
};

// '/:id' PATCH
const updateProject = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({ error: "User not logged in" });
	}

	const { id } = req.params;
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// check if 'id' is a valid id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: "Invalid ID Format" });
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
	try {
		const project = await projectModel.findOneAndUpdate(
			{ _id: id, ownerId: req.user },
			{ ...updatedFields },
			{ new: true }
		);

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}

		res.status(200).json(project);
	} catch (error) {
		return res.status(400).json({ error: "Error updating project" });
	}
};

// '/:id' DELETE
const deleteProject = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({ error: "User not logged in" });
	}
	const { id } = req.params;
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// check if 'id' is a valid id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: "Invalid ID Format" });
	}

	// delete project
	const project = await projectModel.findOneAndDelete({
		_id: id,
		ownerId: req.user,
	});

	if (!project) {
		return res.status(404).json({ error: "Project not found" });
	}
	res.status(200).json(project);
};

// '/:id/' POST
const createListItem = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({ error: "User not logged in" });
	}
	const { id } = req.params;
	const content = req.body;
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// check if 'id' is a valid id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: "Invalid ID Format" });
	}

	const project = await projectModel.findById(req.params.id);

	if (project.ownerId != req.user) {
		return res.status(403).json({ error: "Access Denied" });
	}

	if (!project) {
		return res.status(404).json({ error: "Project not found" });
	}

	try {
		const newItem = project.checklist.create({
			content,
			isCompleted: false,
		});

		project.checklist.push(newItem);

		await project.save();

		res.status(200).json(newItem);
	} catch (error) {
		return res.status(404).json({ error: "Error creating item" });
	}
};

// '/:id/:listID' DELETE
const deleteListItem = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({ error: "User not logged in" });
	}
	const { id, listID } = req.params;
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// check if 'id' is a valid id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: "Invalid ID Format" });
	}

	const project = await projectModel.findById(req.params.id);

	if (project.ownerId != req.user) {
		return res.status(403).json({ error: "Access Denied" });
	}

	if (!project) {
		return res.status(404).json({ error: "Project not found" });
	}

	if (!project.checklist.id(listID)) {
		return res.status(400).json({ error: "Checklist item not found" });
	}

	project.checklist.id(listID).deleteOne();

	await project.save();
	res.status(200).json(project);
};

module.exports = {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
	createListItem,
	deleteListItem,
};
