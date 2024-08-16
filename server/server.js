require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const projectRoutes = require("./routes/projectRoutes");

// create express app
const app = express();

// connect to db and listen to requests
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log("listening on port", process.env.PORT);
		});
	})
	.catch((err) => console.log(err));

// middleware
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

app.use(express.json());

// add routes here
app.use("/projects", projectRoutes);
