const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
	{
		categoryName: { type: String, required: true },
		products: [
			{
				type: Object,
				ref: "Product",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
