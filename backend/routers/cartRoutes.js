const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../crud/cartCrud");
const verifyUser = require("../middlewares/verifyUser");

const router = express.Router();

router.get("/", verifyUser, getCart);
router.post("/add", verifyUser, addToCart);
router.put("/update/:itemId", verifyUser, updateCartItem);
router.delete("/remove/:itemId", verifyUser, removeFromCart);
router.delete("/clear", verifyUser, clearCart);

module.exports = router;

