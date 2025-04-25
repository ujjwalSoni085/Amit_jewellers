const express = require("express");
const { createAdmin, loginAdmin, getAdmin } = require("../crud/adminCrud");
const verifyToken = require("../middlewares/verifyToken"); // Import the verifyToken middleware

const router = express.Router();

// Admin routes
router.post("/signup", createAdmin); // Create a new admin (protected route)
router.post("/login", loginAdmin); // Login an admin (no token required)
router.get("/get", verifyToken, getAdmin); // Get admin details (protected route)
router.get("/access", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access granted" });
}); // Test route to check access

module.exports = router;
