const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signAccessToken } = require("../utils/jwt");

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Create a new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get admin details
const getAdmin = async (req, res) => {
  try {
    const adminId = req.user.id; // Extract the admin ID from req.user

    // Find the admin by the ID in the token
    const admin = await Admin.findById(adminId).select("-password"); // Exclude the password field
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Return the admin details
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login an admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const payload = { id: admin._id, email: admin.email };
    const accessToken = signAccessToken(payload, "admin");

    res
      .status(200)
      .json({
        message: "Login successful",
        authToken: accessToken,
        role: "admin",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  getAdmin,
};
