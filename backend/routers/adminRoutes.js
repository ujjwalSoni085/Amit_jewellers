const express = require("express");
const {
  createAdmin,
  loginAdmin,
  getAdmin,
} = require("../crud/adminCrud");

const router = express.Router();


// Admin routes
router.post("/", createAdmin); // Create a new admin
router.post("/login", loginAdmin); // Login an admin
router.get("/get", getAdmin); // Get admin details

module.exports = router;
