const express = require("express");
const { addCarousel, getAllCarousel, deleteCarousel } = require("../controllers/productCarouselController");
const verifyAdmin = require("../middlewares/verifyAdmin");//varify the admin

//connect the router
const router = express.Router();

router.post("/add", verifyAdmin, addCarousel);
router.get("/", getAllCarousel);

router.delete("/delete/:id", verifyAdmin, deleteCarousel);

module.exports = router;
