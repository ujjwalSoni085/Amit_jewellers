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
const { upload } = require("../utils/cloudinary");

const router = express.Router();

router.post("/add", verifyAdmin, createProductRules, validate, addProduct);
router.get("/", getProducts);

// Upload single image to Cloudinary
const multer = require("multer");

router.post("/upload-image", verifyAdmin, (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: `Cloudinary error: ${err.message}` });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ url: req.file.path });
});
router.get("/:id", getProductById);
router.put("/update/:id", verifyAdmin, updateProduct);
router.delete("/delete/:id", verifyAdmin, deleteProduct);

module.exports = router;
