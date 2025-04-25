const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    console.log("Login attempt with email:", email);

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
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "usersecret_key",
      {
        expiresIn: "1d", // Token expires in 1 day
      }
    );

    // Set the token as a cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    // If login is successful, return user details (excluding password)
    const { password: _, ...userDetails } = user.toObject();
    res.status(200).json({ message: "Login successful", user: userDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {

  try {
    console.log("Get user request",req.user); // Log the request
    const userId = req.user.id; // Extract the user ID from req.user
console.log("User ID from token:", userId); // Log the user ID
    // Find the user by the ID in the token
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

module.exports = { addUser, loginUser, getUser };
