const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Add a new user
const addUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
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
      "your_secret_key",
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
    // Get the token from the request cookies or Authorization header
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

module.exports = { addUser, loginUser, getUser };
