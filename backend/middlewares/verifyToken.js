// deleting product by taking token from the header and id from the url

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log(req.headers); // Debugging line to check headers
  console.log("Middleware called"); // Debugging line to check if middleware is being called

  // Extract token from Authorization header (Bearer <token>)
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("Extracted Token:", token); // Debugging line to check the extracted token

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    console.log("Verifying token..."); // Debugging line to check if token verification is happening
    const decoded = jwt.verify(token, "adminsecret_key"); // Use your secret key
    console.log("Decoded Token:", decoded); // Debugging line to check the decoded token
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
