const express = require("express");
const OrderController = require("../controllers/OrderController");

const router = express.Router();

router.get("/", OrderController.getListOrder);
router.get("/:id", OrderController.getOrder);
router.post("/create", OrderController.handleCreateOrder);
router.put("/update/:id", OrderController.updateStatus);
router.delete("/delete/:id", OrderController.removeOrder);
router.get("/user-orders/:user_id", OrderController.getUserOrders);

module.exports = router;
