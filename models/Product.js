const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		name: { type: String, required: true },
		image: String,
		price: { type: Number, required: true },
		discount: Number,
		quantity: { type: Number, default: 1 },
		description: String,
		rating: String,
		rate_count: Number,
		categories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Category",
			},
		],
	},

	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
