const { verifyAccessToken } = require("../utils/jwt");

module.exports = function verifyAdminToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const isBearer = authHeader.startsWith("Bearer ");
    const token = isBearer ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = verifyAccessToken(token, "admin");
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
