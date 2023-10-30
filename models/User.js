const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	roles: {
		user: {
			type: Number,
			default: 1234,
		},
		editor: Number,
		admin: Number,
	},
	refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
