const Product = require("../models/Product");
const { getPricePerGram } = require("../utils/metalService");

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { title, weight, metalType, image, description, category, purity, images, inStock, tags } = req.body;
        const newProduct = new Product({ title, weight, metalType, image, description, category, purity, images, inStock, tags });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products with computed price with api 
const getProducts = async (req, res) => {
    try {
        const { search, category, purity, minPrice, maxPrice, inStock, page = 1, limit = 10 } = req.query;

        // Build base Mongoose query
        const query = {};
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        if (category) query.category = category;
        if (purity) query.purity = purity;
        if (inStock !== undefined) query.inStock = inStock === 'true';

        // Fetch products matching mongo filters
        const products = await Product.find(query);
        const gold = await getPricePerGram("gold");
        const silver = await getPricePerGram("silver");
        
        let priced = products.map(p => {
            let rate = null;
            if (p.metalType === 'gold') rate = gold;
            else if (p.metalType === 'silver') rate = silver;
            const price = Number.isFinite(rate) && rate > 0 ? Math.round(rate * p.weight) : null;
            return { ...p.toObject(), price };
        });

        // Filter by dynamic price if provided
        if (minPrice || maxPrice) {
            const min = parseFloat(minPrice) || 0;
            const max = parseFloat(maxPrice) || Infinity;
            priced = priced.filter(p => p.price !== null && p.price >= min && p.price <= max);
        }

        // Pagination
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const totalProducts = priced.length;
        const totalPages = Math.ceil(totalProducts / pageSize);
        const startIndex = (pageNumber - 1) * pageSize;
        const paginatedProducts = priced.slice(startIndex, startIndex + pageSize);

        res.json({
            products: paginatedProducts,
            totalPages,
            currentPage: pageNumber,
            totalProducts
        });
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
        const { title, weight, metalType, image, description, category, purity, images, inStock, tags } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { title, weight, metalType, image, description, category, purity, images, inStock, tags },
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
