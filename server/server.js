require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

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

app.use(
	cors({
		origin: "https://tracker.aceauramusic.com",
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(express.text());

// discord auth
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);
