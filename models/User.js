const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		address: String,
		password: { type: String, required: true },
		refreshToken: String,
		roles: {
			user: {
				type: Number,
				default: 1234,
			},
			editor: Number,
			admin: Number,
		},
		wishlist: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		cart: [
			{
				product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				quantity: Number,
				price: Number,
			},
		],
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Order",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
