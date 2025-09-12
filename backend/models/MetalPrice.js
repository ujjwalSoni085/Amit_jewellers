const mongoose = require("mongoose");

const metalPriceSchema = new mongoose.Schema({
  metal: { type: String, enum: ["gold", "silver"], required: true, unique: true },
  pricePerGram: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("MetalPrice", metalPriceSchema);


