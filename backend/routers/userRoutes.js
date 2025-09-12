const express = require("express");
const {
  addUser,
  loginUser,
  getUser
} = require("../crud/userCrud");
const verifyUser = require("../middlewares/verifyUser");

const router = express.Router();

router.post("/signup", addUser);
router.post("/login", loginUser);
router.get("/", verifyUser, getUser);


module.exports = router;