const express = require("express");
const router = express.Router();
const categoriesController = require("../../controllers/categories-controller");
const ROLE = require("../../configs/roles-list");
const verifyRole = require("../../middlewares/verify-role");
const verifyJWT = require("../../middlewares/verify-jwt");

router
	.route("/")
	.get(categoriesController.getAllCategories)
	.post(verifyJWT, verifyRole(ROLE.admin), categoriesController.handleNewCategory);

router
	.route("/:id")
	.get(categoriesController.getCategoryById)
	.put(verifyJWT, verifyRole(ROLE.admin), categoriesController.updateCategoryById)
	.delete(verifyJWT, verifyRole(ROLE.admin), categoriesController.deleteCategoryById);

module.exports = router;
