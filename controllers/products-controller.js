const Product = require("../models/Product");
const Category = require("../models/Category");

const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}, "-__v").populate("categories", "categoryName").exec();
		if (!products) return res.sendStatus(204);

		res.status(200).json({
			message: "Products displayed successfully",
			status: "ok",
			status_code: 200,
			productsCount: products.length,
			data: products,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const getProductById = async (req, res) => {
	try {
		const productId = req.params.id;
		if (!productId) return res.status(400).json({ message: "Product id is required" });

		const product = await Product.findById(productId, "-__v").populate("categories", "name").exec();
		if (!product) return res.status(404).json({ message: "This product id is not found" });

		res.status(200).json({
			message: "Product displayed successfully",
			status: "ok",
			status_code: 200,
			data: product,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
const handleNewProduct = async (req, res) => {
	try {
		const { name, price, quantity, categoryName } = req.body;

		if (!name || !price || !quantity) return res.status(400).json({ message: "Please fill up all inputs" });

		const duplicate = await Product.findOne({ name }).exec();

		if (duplicate) return res.status(409).json({ message: "This product name is already used!" });

		let product;
		const filePath = req.file?.path;

		if (filePath && categoryName) {
			const category = await Category.findOne({ name: categoryName }).exec();

			product = await Product.create({ ...req.body, image: filePath, categories: category._id });

			await Category.updateOne({ _id: category.id }, { $push: { products: product._id } });
		} else if (filePath && !categoryName) {
			product = await Product.create({ ...req.body, image: filePath });
		} else if (categoryName && !filePath) {
			const category = await Category.findOne({ name: categoryName }).exec();

			product = await Product.create({ ...req.body, categories: category._id });

			await Category.updateOne({ _id: category.id }, { $push: { products: product._id } });
		} else {
			product = await Product.create({ ...req.body });
		}

		res.status(201).json({
			message: `Product ${name} is created!`,
			status: "created",
			status_code: 201,
			data: product,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const updateProductById = async (req, res) => {
	try {
		const productId = req.params.id;
		const { name, price, quantity, categoryName } = req.body;

		if (!productId) return res.status(400).json({ message: "Product id is required" });
		if (!name || !price || !quantity) return res.status(400).json({ message: "Please fill up all inputs" });

		const product = await Product.findById(productId).exec();

		if (!product) return res.status(404).json({ message: "This product id is not found " });

		const category = await Category.findOne({ name: categoryName }).exec();

		const filePath = req.file?.path;
		//has image and categories not includes in product
		if (filePath && !product.categories.includes(category?._id)) {
			await Category.updateOne({ _id: category?.id }, { $push: { products: product._id } });

			await Product.updateOne({ _id: productId }, { ...req.body, image: filePath, $push: { categories: category?._id } });
		}
		//no image and categories not includes in product
		else if (!product.categories.includes(category?._id) && !filePath) {
			await Category.updateOne({ _id: category?.id }, { $push: { products: product._id } });

			await Product.updateOne({ _id: productId }, { ...req.body, $push: { categories: category?._id } });
		}
		//has image and categories includes in product
		else if (product.categories.includes(category?._id) && filePath) {
			await Product.updateOne({ _id: productId }, { ...req.body, image: filePath });
		}
		// no image and no categories
		else {
			await Product.updateOne({ _id: productId }, { ...req.body });
		}

		const result = await Product.findById(productId).exec();

		res.status(200).json({
			message: `${result.name} product is updated successfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const deleteProductById = async (req, res) => {
	try {
		const productId = req.params.id;
		if (!productId) return res.status(400).json({ message: "Product id is required" });

		const product = await Product.findById(productId).exec();
		if (!product) return res.status(404).json({ message: "This product is not found" });

		const result = await product.deleteOne();

		res.status(200).json({
			message: `${result.name} product is deleted successfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = { getAllProducts, getProductById, handleNewProduct, updateProductById, deleteProductById };
