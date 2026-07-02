const express = require("express");
const {
  addUser,
  loginUser,
  getUser,
  updateUser
} = require("../controllers/userController");
const verifyUser = require("../middlewares/verifyUser");

const { signupRules, loginRules } = require("../validators/userValidator");
const validate = require("../middlewares/validate");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", authLimiter, signupRules, validate, addUser);
router.post("/login", authLimiter, loginRules, validate, loginUser);
router.get("/", verifyUser, getUser);
router.put("/update", verifyUser, updateUser);

module.exports = router;