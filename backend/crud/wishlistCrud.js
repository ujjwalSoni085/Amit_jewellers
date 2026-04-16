const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const { getPricePerGram } = require("../utils/metalService");

// Helper: populate wishlist products with computed price
const populateWithPrices = async (wishlist) => {
  const productsWithPrice = await Promise.all(
    wishlist.products.map(async (product) => {
      const rate = await getPricePerGram(product.metalType);
      const price =
        Number.isFinite(rate) && rate > 0
          ? Math.round(rate * product.weight)
          : null;
      return { ...product.toObject(), price };
    })
  );
  return { ...wishlist.toObject(), products: productsWithPrice };
};

// GET /api/wishlist — fetch current user's wishlist (with populated products + prices)
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "products"
    );

    // Auto-create empty wishlist if none exists yet
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
      await wishlist.save();
      return res.json({ wishlist: { ...wishlist.toObject(), products: [] } });
    }

    const wishlistWithPrices = await populateWithPrices(wishlist);
    res.json({ wishlist: wishlistWithPrices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/wishlist/add — add a product (no duplicates)
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Confirm product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    // Prevent duplicates
    const alreadyAdded = wishlist.products.some(
      (p) => p.toString() === productId
    );
    if (alreadyAdded) {
      return res.status(409).json({ message: "Product already in wishlist" });
    }

    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate("products");

    const wishlistWithPrices = await populateWithPrices(wishlist);
    res.status(201).json({
      message: "Added to wishlist",
      wishlist: wishlistWithPrices,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/wishlist/remove/:productId — remove one product
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    const before = wishlist.products.length;
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );

    if (wishlist.products.length === before) {
      return res.status(404).json({ error: "Product not in wishlist" });
    }

    await wishlist.save();
    await wishlist.populate("products");

    const wishlistWithPrices = await populateWithPrices(wishlist);
    res.json({ message: "Removed from wishlist", wishlist: wishlistWithPrices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/wishlist/clear — empty the whole wishlist
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({ message: "Wishlist cleared", wishlist: wishlist.toObject() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
