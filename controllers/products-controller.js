const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
	const products = await Product.find();
	if (!products) return res.sendStatus(204);
	res.status(200).json({ data: products });
};
const getProductById = async (req, res) => {
	const productId = req.params.id;
	if (!productId) return res.status(400).json({ message: "Product id is required" });
	const product = await Product.findOne({ _id: productId }).exec();
	if (!product) return res.status(404).json({ message: "This product id is not found" });
	res.status(200).json({ data: product });
};
const handleNewProduct = async (req, res) => {
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
};

const updateProductById = async (req, res) => {
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
};

const deleteProductById = async (req, res) => {
	const productId = req.params.id;
	if (!productId) return res.status(400).json({ message: "Product id is required" });
	const product = await Product.findOne({ _id: productId }).exec();
	if (!product) return res.status(404).json({ message: "This product is not found" });
	const result = await product.deleteOne();

	res.status(200).json({ message: "This product has been removed!", data: result });
};

module.exports = { getAllProducts, getProductById, handleNewProduct, updateProductById, deleteProductById };
