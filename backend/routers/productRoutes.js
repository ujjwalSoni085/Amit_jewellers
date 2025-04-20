const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../crud/productCrud");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/add", addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id",verifyToken, deleteProduct);

module.exports = router;
