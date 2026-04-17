const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { getPricePerGram } = require("../utils/metalService");

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, phoneNumber } = req.body;

    if (!shippingAddress || !phoneNumber) {
      return res.status(400).json({ error: "Shipping address and phone number are required" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      // Get current price per gram for the metal type
      const rate = await getPricePerGram(product.metalType);
      const pricePerItem = Number.isFinite(rate) && rate > 0 ? Math.round(rate * product.weight) : 0;
      const itemPrice = pricePerItem * item.quantity;
      totalAmount += itemPrice;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: pricePerItem,
        title: product.title,
        image: product.image,
      });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      phoneNumber,
      status: "pending",
    });

    await order.save();
    await order.populate("items.product");

    // Do NOT clear cart yet. We will clear it in payment/verify upon successful transaction.
    res.status(201).json({ order, message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email phoneNumber")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();
    await order.populate("items.product");

    res.json({ order, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};

