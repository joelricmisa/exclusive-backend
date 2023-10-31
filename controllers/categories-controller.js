const Category = require("../models/Category");
const Product = require("../models/Product");

const getAllCategories = async (req, res) => {
	const categories = await Category.find();
	if (!categories) return res.sendStatus(204);
	res.status(200).json({ data: categories });
};
const getCategoryById = async (req, res) => {
	const categoryId = req.params.id;
	if (!categoryId) return res.status(400).json({ message: "Category id is required" });
	const category = await Category.findOne({ _id: categoryId }).exec();
	if (!category) return res.status(404).json({ message: "Category is not found" });
	res.status(200).json({ data: category });
};
const handleNewCategory = async (req, res) => {
	const { name, productName } = req.body;

	if (!name) return res.status(400).json({ message: "Name is required" });
	const duplicate = await Category.findOne({ categoryName: name }).exec();
	if (duplicate) return res.status(409).json({ message: "This name is already used" });

	const category = await Category.create({
		categoryName: name,
		products: productName,
	});

	const product = await Product.findOne({ name: productName });
	product.categories.push(category);
	const result = await product.save();

	res.status(201).json({ message: `${name} category is created!`, product: result, category: category });
};
const updateCategoryById = async (req, res) => {
	const { name } = req.body;
	const categoryId = req.params.id;

	if (!categoryId) return res.status(400).json({ message: "Category id is required" });
	if (!name) return res.status(400).json({ message: "Name is required" });
	const category = await Category.findOne({ _id: categoryId }).exec();
	if (!category) return res.status(404).json({ message: "Category is not found" });
	if (name) category.name = name;
	const result = await category.save();
	res.status(200).json({ message: "Updated Category", data: result });
};
const deleteCategoryById = async (req, res) => {
	const categoryId = req.params.id;
	if (!categoryId) return res.status(400).json({ message: "Category id is required" });
	const category = await Category.findOne({ _id: categoryId }).exec();
	if (!category) return res.status(404).json({ message: "This category is not found" });
	const result = await category.deleteOne();
	res.status(200).json({ message: "This category has been removed", data: result });
};

module.exports = { getAllCategories, getCategoryById, handleNewCategory, updateCategoryById, deleteCategoryById };
