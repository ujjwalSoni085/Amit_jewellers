require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// Middleware to serve static files from the React app
app.use(express.static("frontend/build"));

//enable cors for localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Connection Error:", err));

// Import Routes
const productRoutes = require("./routers/productRoutes");
const carouselRoutes = require("./routers/carousel");
const userRoutes = require("./routers/userRoutes");
const adminRoutes = require("./routers/adminRoutes");
app.use("/api/products", productRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
