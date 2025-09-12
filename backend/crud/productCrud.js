const Product = require("../models/Product");
const { getPricePerGram } = require("../utils/metalService");

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { title, weight, metalType, image, description } = req.body;
        const newProduct = new Product({ title, weight, metalType, image, description });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products with computed price with api 
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const gold = await getPricePerGram("gold");
        const silver = await getPricePerGram("silver");
        const priced = products.map(p => {
            let rate = null;
            if (p.metalType === 'gold') rate = gold;
            else if (p.metalType === 'silver') rate = silver;
            const price = Number.isFinite(rate) && rate > 0 ? Math.round(rate * p.weight) : null;
            return { ...p.toObject(), price };
        });
        res.json(priced);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single product by ID with computed price
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        const rate = await getPricePerGram(product.metalType);
        const price = Number.isFinite(rate) && rate > 0 ? Math.round(rate * product.weight) : null;
        const data = { ...product.toObject(), price };
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { title, weight, metalType, image, description } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { title, weight, metalType, image, description },
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addProduct, getProducts, getProductById, updateProduct, deleteProduct };
