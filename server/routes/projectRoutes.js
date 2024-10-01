const express = require("express");
const {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
	createListItem,
	deleteListItem,
} = require("../controllers/projectController");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

router.use(authenticate);

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

// add checklist item to project
router.post("/:id/", createListItem);

// delete checklist item from project
router.delete("/:id/:listID", deleteListItem);

module.exports = router;
