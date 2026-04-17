const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const verifyUser = require("../middlewares/verifyUser");
const Order = require("../models/Order");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order via Razorpay
router.post("/create-order", verifyUser, async (req, res) => {
  try {
    const { amount, currency, initialOrderId } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Amount MUST be integer paise
      currency: currency || "INR",
      receipt: `receipt_order_${initialOrderId}`,
    };

    const order = await razorpay.orders.create(options);

    // Update their temporary order document with Razorpay's ID
    if (initialOrderId) {
      await Order.findByIdAndUpdate(initialOrderId, {
        razorpayOrderId: order.id,
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Could not create payment order" });
  }
});

// Verify the payment signature locally
router.post("/verify", verifyUser, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      local_order_id,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment Successful
      const updatedOrder = await Order.findByIdAndUpdate(
        local_order_id,
        {
          paymentStatus: "completed",
          razorpayPaymentId: razorpay_payment_id,
          status: "confirmed", // Mark as officially ready to process!
        },
        { new: true }
      );

      // Clear the user's cart now that payment is confirmed
      const Cart = require("../models/Cart");
      await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

      return res.status(200).json({ success: true, order: updatedOrder });
    } else {
      // Payment Forged / Failed Verification
      await Order.findByIdAndUpdate(local_order_id, {
        paymentStatus: "failed",
      });
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-key", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
