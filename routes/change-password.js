const express = require("express");
const router = express.Router();
const changePassController = require("../controllers/change-password-controller");
const verifyJWT = require("../middlewares/verify-jwt");

router.post("/", verifyJWT, changePassController.handleChangePassword);
module.exports = router;
