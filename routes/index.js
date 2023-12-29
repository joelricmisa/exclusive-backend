const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const registerRoute = require("./register");
const refreshTokenRoute = require("./refresh-token");
const logoutRoute = require("./logout");
const forgotPasswordRoute = require("./forgot-password");
const resetPasswordRoute = require("./reset-password");
const contactRoute = require("./contact");
const productsRoute = require("./products");
const categoriesRoute = require("./categories");
const ordersRoute = require("./orders");
const changePasswordRoute = require("./change-password");
const usersRoute = require("./users");

router.use("/api/register", registerRoute);
router.use("/api/auth", authRoute);
router.use("/api/refresh", refreshTokenRoute);
router.use("/api/logout", logoutRoute);
router.use("/api/forgot-password", forgotPasswordRoute);
router.use("/api/reset-password", resetPasswordRoute);
router.use("/api/contact", contactRoute);
router.use("/api/categories", categoriesRoute);
router.use("/api/products", productsRoute);
router.use("/api/orders", ordersRoute);
router.use("/api/change-password", changePasswordRoute);
router.use("/api/users", usersRoute);

module.exports = router;
