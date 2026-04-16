const express = require("express");
const {
  addUser,
  loginUser,
  getUser
} = require("../crud/userCrud");
const verifyUser = require("../middlewares/verifyUser");

const { signupRules, loginRules } = require("../validators/userValidator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/signup", signupRules, validate, addUser);
router.post("/login", loginRules, validate, loginUser);
router.get("/", verifyUser, getUser);


module.exports = router;