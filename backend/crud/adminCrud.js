const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const newAdmin = new Admin({ name, email, password:hashedPassword, phoneNumber });
    
    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAdmin = async (req, res) => {  
  try {
    //get the token from the request cookies or authorization header
    const token =
          req.cookies.authToken || req.headers.authorization?.split(" ")[1];
    
        if (!token) {
          return res
            .status(401)
            .json({ error: "Access denied. No token provided." });
        }
    
        // Verify the token
        const decoded = jwt.verify(token, "your_secret_key");
    
        // Find the user by the ID in the token
        const user = await User.findById(decoded.id).select("-password"); // Exclude the password field
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Return the user details
        res.status(200).json({ user });
      } catch (error) {
        res.status(400).json({ error: "Invalid token" });
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
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      "your_secret_key", // Replace with a secure secret key
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Send the token and admin details (excluding password)
    const { password: _, ...adminDetails } = admin.toObject();
    res
      .status(200)
      .json({ message: "Login successful", token, admin: adminDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  getAdmin,
};
