const jwt = require("jsonwebtoken");

// Environment variables with validation
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET;
const USER_SECRET = process.env.USER_JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256";

// Validate required environment variables
if (!ADMIN_SECRET) {
  throw new Error("ADMIN_JWT_SECRET environment variable is required");
}
if (!USER_SECRET) {
  throw new Error("USER_JWT_SECRET environment variable is required");
}

// Validate JWT algorithm
const allowedAlgorithms = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
];
if (!allowedAlgorithms.includes(JWT_ALGORITHM)) {
  throw new Error(
    `JWT_ALGORITHM must be one of: ${allowedAlgorithms.join(", ")}`
  );
}

// Generate access token when signing in
function signAccessToken(payload, role) {
  try {
    const base = { ...payload, role };
    const secret = role === "admin" ? ADMIN_SECRET : USER_SECRET;

    return jwt.sign(base, secret, {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: JWT_ALGORITHM,
    });
  } catch (error) {
    throw new Error(`Failed to sign access token: ${error.message}`);
  }
}

// Verify access token when accessing a protected route
function verifyAccessToken(token, role) {
  try {
    const secret = role === "admin" ? ADMIN_SECRET : USER_SECRET;
    return jwt.verify(token, secret, { algorithms: [JWT_ALGORITHM] });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Access token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid access token");
    } else if (error.name === "NotBeforeError") {
      throw new Error("Access token not active");
    } else {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
