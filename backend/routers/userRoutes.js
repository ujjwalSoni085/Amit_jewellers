const express = require("express");
const {
  addUser,
  loginUser,
  getUser
} = require("../crud/userCrud");

const router = express.Router();

router.post("/signup", addUser);
router.post("/login", loginUser);
router.get("/", getUser);

module.exports = router;