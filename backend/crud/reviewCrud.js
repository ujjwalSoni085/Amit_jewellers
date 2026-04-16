const Review = require("../models/Review");

// GET /api/reviews/:productId — fetch all reviews for a product, with user name
const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name") // only expose name, not password/email
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/reviews — add or update (upsert) a review
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating) {
      return res.status(400).json({ error: "productId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // findOneAndUpdate with upsert = create-or-update in one query
    const review = await Review.findOneAndUpdate(
      { user: userId, product: productId },
      { rating, comment: comment || "" },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "name");

    res.status(200).json({ message: "Review saved", review });
  } catch (error) {
    // Duplicate key error (race condition edge case) — treat as 409
    if (error.code === 11000) {
      return res.status(409).json({ error: "You have already reviewed this product" });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/reviews/:reviewId — delete own review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Ensure only the owner can delete
    if (review.user.toString() !== userId) {
      return res.status(403).json({ error: "Not authorised to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getReviewsForProduct,
  addReview,
  deleteReview,
};
