const express = require("express");
const { fetchAndStorePrices } = require("../utils/metalService");//apis
const MetalPrice = require("../models/MetalPrice");//models
const verifyAdmin = require("../middlewares/verifyAdmin");

const router = express.Router();

router.get("/", async (req, res) => {
  let prices = await MetalPrice.find({}).lean();
  if (!prices || prices.length === 0) {
    try {
      await fetchAndStorePrices();
      prices = await MetalPrice.find({}).lean();
    } catch {}
  }
  res.json(prices);
});

router.post("/refresh", verifyAdmin, async (req, res) => {
  try {
    const data = await fetchAndStorePrices();
    res.json({ message: "Prices refreshed", ...data });
  } catch (e) {
    res.status(500).json({ message: "Failed to refresh prices" });
  }
});

module.exports = router;


