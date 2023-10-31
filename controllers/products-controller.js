const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find();
		if (!products) return res.sendStatus(204);
		res.status(200).json({ data: products });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const getProductById = async (req, res) => {
	try {
		const productId = req.params.id;
		if (!productId) return res.status(400).json({ message: "Product id is required" });
		const product = await Product.findOne({ _id: productId }).exec();
		if (!product) return res.status(404).json({ message: "This product id is not found" });
		res.status(200).json({ data: product });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
const handleNewProduct = async (req, res) => {
	try {
		const { name, image, price, discount, quantity, rating } = req.body;

		if (!name || !price || !quantity) return res.status(400).json({ message: "Please fill up all inputs" });

		const duplicate = await Product.findOne({ name }).exec();

		if (duplicate) return res.status(409).json({ message: "This product name is already used!" });

		const product = await Product.create({
			name,
			image,
			price,
			discount,
			quantity,
			rating,
		});

		res.status(201).json({ message: `${name} is created!`, data: product });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const updateProductById = async (req, res) => {
	try {
		const productId = req.params.id;
		const { name, image, price, discount, quantity, rating } = req.body;

		if (!productId) return res.status(400).json({ message: "Product id is required" });
		if (!name || !price || !quantity) return res.status(400).json({ message: "Please fill up all inputs" });

		const product = await Product.findOne({ _id: productId }).exec();

		if (!product) return res.status(404).json({ message: "This product id is not found " });

		if (name) product.name = name;
		if (image) product.image = image;
		if (price) product.price = price;
		if (discount) product.discount = discount;
		if (quantity) product.quantity = quantity;
		if (rating) product.rating = rating;

		const result = await product.save();

		res.status(200).json({ message: `Updated product`, data: result });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const deleteProductById = async (req, res) => {
	try {
		const productId = req.params.id;
		if (!productId) return res.status(400).json({ message: "Product id is required" });
		const product = await Product.findOne({ _id: productId }).exec();
		if (!product) return res.status(404).json({ message: "This product is not found" });
		const result = await product.deleteOne();

		res.status(200).json({ message: "This product has been removed!", data: result });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = { getAllProducts, getProductById, handleNewProduct, updateProductById, deleteProductById };
