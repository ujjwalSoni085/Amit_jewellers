const express = require('express');
const { addCarousel, getAllCarousel } = require('../crud/productcarousel');

const router = express.Router();

router.post('/add', addCarousel);
router.get('/', getAllCarousel);

module.exports = router;
