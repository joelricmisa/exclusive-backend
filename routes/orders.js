const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders-controller");
router.route("/").post(ordersController.createOrder).get(ordersController.getAllOrders);
router.route("/:id").get(ordersController.getOrderById).patch(ordersController.updateOrderStatus).delete(ordersController.deleteOrderById);
router.route("/user/:id").get(ordersController.getOrderByUserId);
module.exports = router;
