const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price at time of order
  title: { type: String, required: true }, // Snapshot of product title
  image: { type: String, required: true }, // Snapshot of product image
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  phoneNumber: { type: String, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "completed", "failed"], 
    default: "pending" 
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
}, { timestamps: true });

orderSchema.index({ user: 1 });

module.exports = mongoose.model("Order", orderSchema);

