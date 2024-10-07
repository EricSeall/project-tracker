require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const router = express.Router();
const { sign } = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

//router.use(authenticate);

router.get("/test", async (req, res) => {
	res.status(200).send("test");
});

router.get("/discord/redirect", async (req, res) => {
	const { code } = req.query;
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");

	if (code) {
		// use code to get token
		const formData = new URLSearchParams({
			client_id: process.env.CLIENTID,
			client_secret: process.env.CLIENTSECRET,
			grant_type: "authorization_code",
			code: code.toString(),
			redirect_uri: "https://server.aceauramusic.com/api/auth/discord/redirect",
		});

		const response = await fetch("https://discord.com/api/oauth2/token", {
			method: "POST",
			body: formData,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const json = await response.json();

		const access = json.access_token;

		// use token to get user data
		const userInfo = await fetch("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `Bearer ${access}`,
			},
		});

		const userData = await userInfo.json();

		const { id, avatar, username, email, global_name } = userData;

		// refresh token
		const refreshFormData = new URLSearchParams({
			client_id: process.env.CLIENTID,
			client_secret: process.env.CLIENTSECRET,
			grant_type: "refresh_token",
			refresh_token: json.refresh_token,
		});

		const refresh = await fetch("https://discord.com/api/oauth2/token", {
			method: "POST",
			body: refreshFormData,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const refreshData = await refresh.json();

		// save all data in database here
		const user = await userModel.findOne({ discordId: id });

		// give browser JWT token
		const token = await sign({ sub: id }, process.env.JWT_SECRET, {
			expiresIn: "90m",
		});
		const refresh_token = await sign({ sub: id }, process.env.JWT_SECRET);

		if (user) {
			await userModel.updateOne(
				{ discordId: id },
				{
					avatar: avatar,
					username: username,
					email: email,
					globalName: global_name,
					refresh_token: refresh_token,
				}
			);
		} else {
			await userModel.create({
				discordId: id,
				avatar: avatar,
				username: username,
				email: email,
				globalName: global_name,
				refresh_token: refresh_token,
			});
		}

		res.cookie("token", token, {
			sameSite: "none",
			maxAge: 1000 * 60 * 60 * 24 * 90,
			secure: true,
			httpOnly: true,
		});
		res.cookie("refresh_token", refresh_token, {
			sameSite: "none",
			maxAge: 1000 * 60 * 60 * 24 * 90,
			secure: true,
			httpOnly: true,
		});
		res.status(200).redirect(process.env.CLIENT_REDIRECT_URL);
		console.log(json, userData, refreshData);
	}
});

module.exports = router;
