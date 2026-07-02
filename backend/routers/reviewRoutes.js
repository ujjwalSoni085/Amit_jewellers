const express = require("express");
const {
  getReviewsForProduct,
  addReview,
  deleteReview,
} = require("../controllers/reviewController");
const verifyUser = require("../middlewares/verifyUser");

const router = express.Router();

// Public: get all reviews for a product
router.get("/:productId", getReviewsForProduct);

// Auth required: add or update own review
router.post("/", verifyUser, addReview);

// Auth required: delete own review
router.delete("/:reviewId", verifyUser, deleteReview);

module.exports = router;
