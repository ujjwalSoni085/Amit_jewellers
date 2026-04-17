const express = require("express");
const {
  createAdmin,
  loginAdmin,
  getAdmin,
} = require("../crud/adminCrud");
const allowFirstAdminOrRequireAdmin = require("../middlewares/allowFirstAdminOrRequireAdmin");
const verifyAdmin = require("../middlewares/verifyAdmin");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", authLimiter, allowFirstAdminOrRequireAdmin, createAdmin);
router.post("/login", authLimiter, loginAdmin);
router.get("/", verifyAdmin, getAdmin);

module.exports = router;
