const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { getPricePerGram } = require("../utils/metalService");

// Get user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    // Calculate prices for each item
    const itemsWithPrice = await Promise.all(
      cart.items.map(async (item) => {
        const product = item.product;
        const rate = await getPricePerGram(product.metalType);
        const price = Number.isFinite(rate) && rate > 0 ? Math.round(rate * product.weight) : null;
        return {
          _id: item._id,
          product: {
            ...product.toObject(),
            price,
          },
          quantity: item.quantity,
        };
      })
    );

    res.json({ cart: { ...cart.toObject(), items: itemsWithPrice } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    // Calculate prices
    const itemsWithPrice = await Promise.all(
      cart.items.map(async (item) => {
        const product = item.product;
        const rate = await getPricePerGram(product.metalType);
        const price = Number.isFinite(rate) && rate > 0 ? Math.round(rate * product.weight) : null;
        return {
          _id: item._id,
          product: {
            ...product.toObject(),
            price,
          },
          quantity: item.quantity,
        };
      })
    );

    res.json({ cart: { ...cart.toObject(), items: itemsWithPrice } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    // Calculate prices
    const itemsWithPrice = await Promise.all(
      cart.items.map(async (item) => {
        const product = item.product;
        const rate = await getPricePerGram(product.metalType);
        const price = Number.isFinite(rate) && rate > 0 ? Math.round(rate * product.weight) : null;
        return {
          _id: item._id,
          product: {
            ...product.toObject(),
            price,
          },
          quantity: item.quantity,
        };
      })
    );

    res.json({ cart: { ...cart.toObject(), items: itemsWithPrice } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();
    await cart.populate("items.product");

    // Calculate prices
    const itemsWithPrice = await Promise.all(
      cart.items.map(async (item) => {
        const product = item.product;
        const rate = await getPricePerGram(product.metalType);
        const price = Number.isFinite(rate) && rate > 0 ? Math.round(rate * product.weight) : null;
        return {
          _id: item._id,
          product: {
            ...product.toObject(),
            price,
          },
          quantity: item.quantity,
        };
      })
    );

    res.json({ cart: { ...cart.toObject(), items: itemsWithPrice } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

