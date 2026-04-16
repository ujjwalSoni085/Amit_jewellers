const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../crud/orderCrud");
const verifyUser = require("../middlewares/verifyUser");
const verifyAdmin = require("../middlewares/verifyAdmin");

const router = express.Router();

// User routes
router.post("/create", verifyUser, createOrder);
router.get("/", verifyUser, getUserOrders);
router.get("/:id", verifyUser, getOrderById);

// Admin routes
router.get("/admin/all", verifyAdmin, getAllOrders);
router.put("/admin/update/:id", verifyAdmin, updateOrderStatus);

module.exports = router;

