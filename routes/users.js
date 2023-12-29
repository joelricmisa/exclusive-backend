const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const ROLE = require("../configs/roles-list");
const verifyRole = require("../middlewares/verify-role");
const verifyJWT = require("../middlewares/verify-jwt");

router.route("/current").get(verifyJWT, usersController.getCurrentUser);

router.route("/").get(verifyJWT, verifyRole(ROLE.admin), usersController.getAllUsers).post(usersController.handleNewUser);

router
	.route("/:id")
	.get(verifyJWT, verifyRole(ROLE.user, ROLE.admin), usersController.getUserById)
	.put(verifyJWT, verifyRole(ROLE.user, ROLE.admin), usersController.updateUserById)
	.delete(verifyJWT, verifyRole(ROLE.admin), usersController.deleteUserById);

router.patch("/:id/cart", verifyJWT, verifyRole(ROLE.user, ROLE.admin), usersController.updateCart);
router.patch("/:id/cart/remove", verifyJWT, verifyRole(ROLE.user, ROLE.admin), usersController.removeCartItem);

router
	.route("/:id/remove-from-wishlist/:productId")
	.put(verifyJWT, verifyRole(ROLE.user, ROLE.admin), usersController.removeProductFromWishlist);

module.exports = router;
