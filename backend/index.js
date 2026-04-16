require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS allowed origins from environment (comma-separated). Fallback to localhost in dev.
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
if (allowedOrigins.length === 0 && process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173","http://127.0.0.1:5173");
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Connection Error:", err));

// Import Routes
const productRoutes = require("./routers/productRoutes");
const carouselRoutes = require("./routers/carousel");
const userRoutes = require("./routers/userRoutes");
const adminRoutes = require("./routers/adminRoutes");
const authRoutes = require("./routers/authRoutes");
const priceRoutes = require("./routers/priceRoutes");
const cartRoutes = require("./routers/cartRoutes");
const orderRoutes = require("./routers/orderRoutes");
const wishlistRoutes = require("./routers/wishlistRoutes");
const reviewRoutes = require("./routers/reviewRoutes");

// Use Routes
app.use("/api/products", productRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

