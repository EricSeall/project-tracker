const { verify, sign } = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
	const token = req.cookies.token;
	const refresh_token = req.cookies.refresh_token;

	res.setHeader(
		"Access-Control-Allow-Origin",
		"https://tracker.aceauramusic.com"
	);
	try {
		const { sub } = await verify(token, process.env.JWT_SECRET);
		console.log(sub);
		req.user = sub;
		next();
	} catch (e1) {
		// TODO access token doesn't work, try refreshing
		try {
			const { sub } = await verify(refresh_token, process.env.JWT_SECRET);
			console.log("user id", sub);
			if (userModel.findOne({ discordId: sub, refresh_token: refresh_token })) {
				// issue new access token
				console.log("user found");
				const token = await sign({ sub: sub }, process.env.JWT_SECRET, {
					expiresIn: "90m",
				});
				res.cookie("token", token);
				req.user = sub;
				next();
			}
		} catch (e2) {
			// if refresh token doesn't work/doesnt exist
			console.log(e2);

			req.user = null;
			res.clearCookie("token");
			return res.json({ error: "Cound not authenticate user" });
		}
	}
};
