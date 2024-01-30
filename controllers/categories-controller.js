const Category = require("../models/Category");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({}, "name products")
			.populate("products", "name image price discount quantity rating rate_count")
			.exec();
		if (!categories)
			return res.status(204).json({
				status: "success",
				code: "204",
				message: "NoContent",
				details: "Request successful, but no content available",
			});

		res.status(200).json({
			message: "Categories displayed successfully",
			status: "ok",
			status_code: 200,
			categoriesCount: categories.length,
			data: categories,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

const getCategoryById = async (req, res) => {
	try {
		const categoryId = req.params.id;
		if (!categoryId) return resErr(res, 400, "Category id is required in url parameter");

		const category = await Category.findById(categoryId, "name products")
			.populate("products", "name image price discount quantity rating rate_count")
			.exec();

		if (!category) return resErr(res, 404, "Category is not found");

		res.status(200).json({
			message: "Category displayed successfully",
			status: "ok",
			status_code: 200,
			data: category,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

const handleNewCategory = async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) return resErr(res, 400, "Name is required");

		const duplicate = await Category.findOne({ name }).exec();

		if (duplicate) return resErr(res, 409, "This name is already used");

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
		errorHandler(req, err);
	}
};

const updateCategoryById = async (req, res) => {
	try {
		const bodyData = req.body;
		const categoryId = req.params.id;

		if (!categoryId) return resErr(res, 400, "Category id is required");

		if (!bodyData.name) return resErr(res, 400, "Name is required");

		const category = await Category.updateOne({ _id: categoryId }, { ...bodyData }).exec();

		if (!category) return resErr(res, 404, "Category is not found");

		const result = await Category.findById(categoryId).exec();

		res.status(200).json({
			message: `${result.name} category is updated successfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

const deleteCategoryById = async (req, res) => {
	try {
		const categoryId = req.params.id;
		if (!categoryId) return resErr(res, 400, "Category id is required");

		const category = await Category.findById(categoryId).exec();

		if (!category) return resErr(res, 404, "Category is not found");

		const result = await category.deleteOne();
		res.status(200).json({
			message: `${result.name} category is deleted successfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = { getAllCategories, getCategoryById, handleNewCategory, updateCategoryById, deleteCategoryById };
