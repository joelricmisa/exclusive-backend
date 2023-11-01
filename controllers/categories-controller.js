const Category = require("../models/Category");
const Product = require("../models/Product");

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({}, "categoryName products")
			.populate("products", "name image price discount quantity rating")
			.exec();
		if (!categories) return res.sendStatus(204);
		res.status(200).json({ data: categories });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const getCategoryById = async (req, res) => {
	try {
		const categoryId = req.params.id;
		if (!categoryId) return res.status(400).json({ message: "Category id is required" });
		const category = await Category.findOne({ _id: categoryId }).exec().catch();
		if (!category) return res.status(404).json({ message: "Category is not found" });
		res.status(200).json({ data: category });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
const handleNewCategory = async (req, res) => {
	try {
		const { name, productName } = req.body;

		if (!name) return res.status(400).json({ message: "Name is required" });
		const duplicate = await Category.findOne({ categoryName: name })
			.populate("products", "name image price discount quantity rating")
			.exec();
		if (duplicate) return res.status(409).json({ message: "This name is already used" });

		const product = await Product.findOne({ name: productName });

		const category = await Category.create({
			categoryName: name,
			products: product._id,
		});

		product.categories = category._id;
		const result = await product.save();

		res.status(201).json({ message: `${name} category is created!`, product: result, category: category });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const updateCategoryById = async (req, res) => {
	try {
		const { name } = req.body;
		const categoryId = req.params.id;

		if (!categoryId) return res.status(400).json({ message: "Category id is required" });
		if (!name) return res.status(400).json({ message: "Name is required" });
		const category = await Category.findOne({ _id: categoryId }).exec();
		if (!category) return res.status(404).json({ message: "Category is not found" });
		if (name) category.name = name;
		const result = await category.save();
		res.status(200).json({ message: "Updated Category", data: result });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
const deleteCategoryById = async (req, res) => {
	try {
		const categoryId = req.params.id;
		if (!categoryId) return res.status(400).json({ message: "Category id is required" });
		const category = await Category.findOne({ _id: categoryId }).exec();
		if (!category) return res.status(404).json({ message: "This category is not found" });
		const result = await category.deleteOne();
		res.status(200).json({ message: "This category has been removed", data: result });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = { getAllCategories, getCategoryById, handleNewCategory, updateCategoryById, deleteCategoryById };
