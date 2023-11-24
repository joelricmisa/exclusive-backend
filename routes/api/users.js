const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users-controller");
const ROLE = require("../../configs/roles-list");
const verifyRole = require("../../middlewares/verify-role");

router.route("/").get(verifyRole(ROLE.admin), usersController.getAllUsers).post(verifyRole(ROLE.admin), usersController.handleNewUser);

router.route("/current").get(usersController.getCurrentUser);

router
	.route("/:id")
	.get(verifyRole(ROLE.admin), usersController.getUserById)
	.put(verifyRole(ROLE.admin), usersController.updateUserById)
	.delete(verifyRole(ROLE.admin), usersController.deleteUserById);

module.exports = router;
