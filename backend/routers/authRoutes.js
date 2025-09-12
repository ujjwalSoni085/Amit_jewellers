const express = require("express");

const router = express.Router();

router.post("/logout", (req, res) => {
  return res.status(200).json({ message: "Logged out" });
});

module.exports = router;
