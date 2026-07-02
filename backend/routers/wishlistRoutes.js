const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");
const verifyUser = require("../middlewares/verifyUser");

const router = express.Router();

// All wishlist routes require a logged-in user
router.get("/", verifyUser, getWishlist);
router.post("/add", verifyUser, addToWishlist);
router.delete("/remove/:productId", verifyUser, removeFromWishlist);
router.delete("/clear", verifyUser, clearWishlist);

module.exports = router;
