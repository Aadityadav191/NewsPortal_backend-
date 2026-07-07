import User from "../models/User.js";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");
const { hashPassword, comparePassword } = require("../utils/hashPassword.js");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (role && role !== "AUTHOR") {
      return res.status(403).json({ message: "Unauthorized role assignment." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "AUTHOR", // Defaults to Author for public signups
    });

    // Generate Token
    const token = generateToken(newUser._id);

    // Hide password from response body
    newUser.password = undefined;
    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      logger.warn(`Login failed: User not found (${email})`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    // Check if account has been deactivated by Super Admin
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Your account has been deactivated." });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Simple profile route to test token validation
export const getMe = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
};

module.exports = {
  signup,
  login,
  getMe,
};
