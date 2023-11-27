const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/password-controller");

router.post("/", passwordController.handleForgotPassword);

module.exports = router;
