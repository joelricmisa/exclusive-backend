const Order = require("../models/Order");
const errorHandler = require("../utils/error-handler");

const createOrder = async (req, res) => {
	try {
		const { user_id, products } = req.body;

		const total_price = products.reduce((total, product) => total + product.price * product.quantity, 0);

		const newOrder = new Order({
			user_id,
			products,
			total_price,
			status: "Processing",
		});

		await newOrder.save();

		res.status(201).json(newOrder);
	} catch (err) {
		errorHandler(req, err);
	}
};

const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find().exec();
		res.json(orders);
	} catch (err) {
		errorHandler(req, err);
	}
};

const getOrderById = async (req, res) => {
	try {
		const orderId = req.params.id;
		const order = await Order.findById(orderId).populate("user_id").exec();

		if (!order) {
			return res.status(404).json({ error: "Order not found" });
		}

		res.json(order);
	} catch (err) {
		errorHandler(req, err);
	}
};

const getOrderByUserId = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await Order.find({ user_id: userId }).populate({ path: "products.product_id" }).exec();

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (err) {
		errorHandler(req, err);
	}
};

const updateOrderStatus = async (req, res) => {
	try {
		const orderId = req.params.id;
		const { status } = req.body;

		const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

		if (!updatedOrder) {
			return res.status(404).json({ error: "Order not found" });
		}

		res.json(updatedOrder);
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = {
	createOrder,
	getAllOrders,
	getOrderById,
	updateOrderStatus,
	getOrderByUserId,
};
