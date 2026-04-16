const express = require("express");
const {
  createAdmin,
  loginAdmin,
  getAdmin,
} = require("../crud/adminCrud");
const allowFirstAdminOrRequireAdmin = require("../middlewares/allowFirstAdminOrRequireAdmin");
const verifyAdmin = require("../middlewares/verifyAdmin");

const router = express.Router();

router.post("/signup", allowFirstAdminOrRequireAdmin, createAdmin);
router.post("/login", loginAdmin);
router.get("/", verifyAdmin, getAdmin);

module.exports = router;
