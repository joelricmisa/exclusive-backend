const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/products-controller");
const ROLE = require("../../configs/roles-list");
const verifyRole = require("../../middlewares/verify-role");

router
	.route("/")
	.get(verifyRole(ROLE.admin), productsController.getAllProducts)
	.post(verifyRole(ROLE.admin), productsController.handleNewProduct);

router
	.route("/:id")
	.get(verifyRole(ROLE.admin), productsController.getProductById)
	.put(verifyRole(ROLE.admin), productsController.updateProductById)
	.delete(verifyRole(ROLE.admin), productsController.deleteProductById);

module.exports = router;
