const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
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
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
