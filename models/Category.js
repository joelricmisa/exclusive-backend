const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
	{
		categoryName: { type: String, required: true },
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
