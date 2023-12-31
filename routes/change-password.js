const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/password-controller");
const verifyJWT = require("../middlewares/verify-jwt");

router.post("/", verifyJWT, passwordController.handleChangePassword);
module.exports = router;
