const express = require("express");
const { createAdmin, loginAdmin, getAdmin } = require("../crud/adminCrud");
const verifyAdmin = require("../middlewares/verifyAdmin");
const allowFirstAdminOrRequireAdmin = require("../middlewares/allowFirstAdminOrRequireAdmin");

const router = express.Router();

// Admin routes
router.post("/signup", allowFirstAdminOrRequireAdmin, createAdmin);
router.post("/login", loginAdmin); // Login an admin (no token required)
router.get("/access", verifyAdmin, (req, res) => {
  res.status(200).json({ message: "Access granted" });
}); // Test route to check access

module.exports = router;
