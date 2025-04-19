const express = require("express");
const { addCarousel, getAllCarousel, deleteCarousel } = require("../crud/productcarousel");

const router = express.Router();

router.post("/add", addCarousel);
router.get("/", getAllCarousel);

router.delete("/delete/:id", deleteCarousel);

module.exports = router;
