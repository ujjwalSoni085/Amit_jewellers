const carousel = require("../models/carousel");

const addCarousel = async (req, res) => { 
    try {
        const { title, image } = req.body;
        const newCarousel = new carousel({ title, image });
        await newCarousel.save();
        res.status(201).json(newCarousel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllCarousel = async (req, res) => {
    try {
        const carousels = await carousel.find();
        res.json(carousels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteCarousel = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCarousel = await carousel.findByIdAndDelete(id);
        if (!deletedCarousel) {
            return res.status(404).json({ message: "Carousel not found" });
        }
        res.json(deletedCarousel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    addCarousel,
    getAllCarousel,
    deleteCarousel,
};