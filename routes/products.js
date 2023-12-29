const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products-controller");
const ROLE = require("../configs/roles-list");
const verifyRole = require("../middlewares/verify-role");
const verifyJWT = require("../middlewares/verify-jwt");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

router
	.route("/")
	.get(productsController.getAllProducts)
	.post(verifyJWT, verifyRole(ROLE.admin), upload.single("image"), productsController.handleNewProduct);

router
	.route("/:id")
	.get(productsController.getProductById)
	.put(verifyJWT, verifyRole(ROLE.admin), upload.single("image"), productsController.updateProductById)
	.delete(verifyJWT, verifyRole(ROLE.admin), productsController.deleteProductById);

module.exports = router;
