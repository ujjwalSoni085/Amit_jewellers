const axios = require("axios");
const MetalPrice = require("../models/MetalPrice");

async function fetchAndStorePrices() {
  const goldUrl = process.env.GOLD_API_URL;
  const goldKey = process.env.GOLD_API_KEY;

  const headersGold = goldKey ? { "x-access-token": goldKey } : {};
//this is for get the price from the api
  const goldRes = goldUrl ? await axios.get(goldUrl, { headers: headersGold }).catch((err) => { 
    console.log("Gold API error:", err.message); 
    return null; 
  }) : null;
//this is for parse the price from the api response
  const parsedGold = goldRes && (goldRes.data.price_gram_24k ?? goldRes.data.pricePerGram);
  
  console.log("Gold response:", goldRes?.data);
//convert the price into number
  const goldPerGram = Number(parsedGold);
//this is for save the price in gold
  if (Number.isFinite(goldPerGram) && goldPerGram > 0) {
    await MetalPrice.findOneAndUpdate(
      { metal: "gold" },
      { pricePerGram: goldPerGram },
      { upsert: true, new: true }
    );
  }

  return { goldPerGram: Number.isFinite(goldPerGram) ? goldPerGram : null };
}
// this is for get the price per gram
async function getPricePerGram(metal) {
  const doc = await MetalPrice.findOne({ metal });
  return doc ? doc.pricePerGram : null;
}

module.exports = { fetchAndStorePrices, getPricePerGram };


