const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		image: String,
		price: { type: String, required: true },
		discount: Number,
		quantity: { type: Number, default: 1 },
		rating: String,
		categories: [
			{
				type: Object,
				ref: "Category",
			},
		],
	},

	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
