const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		discordId: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			required: true,
		},
		email: String,
		globalName: String,
		refresh_token: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
