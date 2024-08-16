const express = require("express");
const {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
} = require("../controllers/projectController");
const router = express.Router();

///// ROUTES

// Get all projects
router.get("/", getProjects);

// get individual project
router.get("/:id", getProject);

// create new project
router.post("/", createProject);

// update existing project
router.patch("/:id", updateProject);

// delete project
router.delete("/:id", deleteProject);

module.exports = router;
