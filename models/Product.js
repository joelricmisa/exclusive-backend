const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		name: { type: String, required: true },
		image: String,
		price: { type: String, required: true },
		discount: Number,
		quantity: { type: Number, default: 1 },
		rating: String,
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
