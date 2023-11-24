const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users-controller");
const ROLE = require("../../configs/roles-list");
const verifyRole = require("../../middlewares/verify-role");
const verifyJWT = require("../../middlewares/verify-jwt");

router.route("/current").get(usersController.getCurrentUser);

router.route("/").get(verifyJWT, verifyRole(ROLE.admin), usersController.getAllUsers).post(usersController.handleNewUser);

router
	.route("/:id")
	.get(verifyJWT, verifyRole(ROLE.user, ROLE.admin), usersController.getUserById)
	.put(verifyJWT, verifyRole(ROLE.user, ROLE.admin), usersController.updateUserById)
	.delete(verifyJWT, verifyRole(ROLE.admin), usersController.deleteUserById);

module.exports = router;
