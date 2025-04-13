const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },  
});

module.exports = mongoose.model("Product", productSchema);
