const express = require("express");
const router = express.Router();
const categoriesController = require("../../controllers/categories-controller");
const ROLE = require("../../configs/roles-list");
const verifyRole = require("../../middlewares/verify-role");

router
	.route("/")
	.get(verifyRole(ROLE.admin), categoriesController.getAllCategories)
	.post(verifyRole(ROLE.admin), categoriesController.handleNewCategory);

router
	.route("/:id")
	.get(categoriesController.getCategoryById)
	.put(verifyRole(ROLE.admin), categoriesController.updateCategoryById)
	.delete(verifyRole(ROLE.admin), categoriesController.deleteCategoryById);

module.exports = router;
