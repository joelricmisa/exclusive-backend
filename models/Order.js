const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema({
	product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
	quantity: Number,
	price: Number,
});

const orderSchema = new mongoose.Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	products: [orderProductSchema],
	total_price: Number,
	order_date: { type: Date, default: Date.now },
	status: String,
});

module.exports = mongoose.model("Order", orderSchema);
