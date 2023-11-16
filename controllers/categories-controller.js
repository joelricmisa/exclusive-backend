const Category = require("../models/Category");
const Product = require("../models/Product");

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({}, "name products").populate("products", "name image price discount quantity rating").exec();
		if (!categories) return res.sendStatus(204);

		res.status(200).json({
			message: "Categories displayed successfully",
			status: "ok",
			status_code: 200,
			categoriesCount: categories.length,
			data: categories,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getCategoryById = async (req, res) => {
	try {
		const categoryId = req.params.id;
		if (!categoryId) return res.status(400).json({ message: "Category id is required" });

		const category = await Category.findById(categoryId, "name products")
			.populate("products", "name image price discount quantity rating")
			.exec();
		if (!category) return res.status(404).json({ message: "Category is not found" });

		res.status(200).json({
			message: "Category displayed successfully",
			status: "ok",
			status_code: 200,
			data: category,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const handleNewCategory = async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) return res.status(400).json({ message: "Name is required" });

		const duplicate = await Category.findOne({ name }).exec();
		if (duplicate) return res.status(409).json({ message: "This name is already used" });

		const category = await Category.create({
			name,
		});

		res.status(201).json({
			message: `${name} category is created!`,
			status: "created",
			status_code: 201,
			data: category,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const updateCategoryById = async (req, res) => {
	try {
		const bodyData = req.body;
		const categoryId = req.params.id;

		if (!categoryId) return res.status(400).json({ message: "Category id is required" });
		if (!bodyData.name) return res.status(400).json({ message: "Name is required" });

		const category = await Category.updateOne({ _id: categoryId }, { ...bodyData }).exec();

		if (!category) return res.status(404).json({ message: "Category is not found" });

		const result = await Category.findById(categoryId).exec();

		res.status(200).json({
			message: `${result.name} category is updated successfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const deleteCategoryById = async (req, res) => {
	try {
		const categoryId = req.params.id;
		if (!categoryId) return res.status(400).json({ message: "Category id is required" });

		const category = await Category.findById(categoryId).exec();
		if (!category) return res.status(404).json({ message: "This category is not found" });

		const result = await category.deleteOne();
		res.status(200).json({
			message: `${result.name} category is deleted successfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = { getAllCategories, getCategoryById, handleNewCategory, updateCategoryById, deleteCategoryById };
