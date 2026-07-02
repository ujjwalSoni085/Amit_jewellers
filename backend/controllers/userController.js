const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signAccessToken } = require("../utils/jwt");

// Add a new user
const addUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, profile } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      profile,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// user login
const loginUser = async (req, res) => {
  try {
    console.log("Login request body:", req.body); // Log the request body
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const payload = { id: user._id, email: user.email };
    const accessToken = signAccessToken(payload, "user");

    res
      .status(200)
      .json({
        message: "Login successful",
        authToken: accessToken,
        role: "user",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from req.user
    const user = await User.findById(userId).select("-password");
    // Exclude the password field
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phoneNumber, savedAddress } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phoneNumber, savedAddress },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addUser, loginUser, getUser, updateUser };
