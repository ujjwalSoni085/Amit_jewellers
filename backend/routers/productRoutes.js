const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../crud/productCrud");

const verifyAdmin = require("../middlewares/verifyAdmin");
const { createProductRules, updateProductRules } = require("../validators/productValidator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/add", verifyAdmin, createProductRules, validate, addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/update/:id", verifyAdmin, updateProduct);
router.delete("/delete/:id", verifyAdmin, deleteProduct);

module.exports = router;
