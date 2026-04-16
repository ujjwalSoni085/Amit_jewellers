const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    weight: { type: Number, required: true },
    metalType: { type: String, enum: ["gold", "silver"], required: true },
    category: { type: String }, // e.g., Rings, Necklaces
    purity: { type: String }, // e.g., 22K, 24K, 925 Sterling
    image: { type: String, required: true }, // Keep for backward compat
    images: [{ type: String }], // Multiple images support
    description: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    tags: [{ type: String }], // e.g., "bestseller", "wedding"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
