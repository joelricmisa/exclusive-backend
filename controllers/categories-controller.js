const Category = require("../models/Category");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");
const resSuccess = require("../utils/res-success");

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

		resSuccess(res, 200, "Categories displayed successfully", { categoriesCount: categories.length, categories });
	} catch (err) {
		errorHandler(req, res, err);
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

		resSuccess(res, 200, "Category displayed successfully", category);
	} catch (err) {
		errorHandler(req, res, err);
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

		resSuccess(res, 201, `${name} category is created!`, category);
	} catch (err) {
		errorHandler(req, res, err);
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

		resSuccess(res, 200, `${result.name} category is updated successfully`, result);
	} catch (err) {
		errorHandler(req, res, err);
	}
};

const deleteCategoryById = async (req, res) => {
	try {
		const categoryId = req.params.id;
		if (!categoryId) return resErr(res, 400, "Category id is required");

		const category = await Category.findById(categoryId).exec();

		if (!category) return resErr(res, 404, "Category is not found");

		const result = await category.deleteOne();

		resSuccess(res, 200, `${result.name} category is deleted successfully`, { id: result._id });
	} catch (err) {
		errorHandler(req, res, err);
	}
};

module.exports = { getAllCategories, getCategoryById, handleNewCategory, updateCategoryById, deleteCategoryById };
