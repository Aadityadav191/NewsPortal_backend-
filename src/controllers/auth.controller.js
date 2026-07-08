const User = require("../models/user.models.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt.js");
const { hashPassword, comparePassword } = require("../utils/password.js");

// Signup Controller for new users
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    if (role && role !== "AUTHOR") {
      return res.status(403).json({ message: "Unauthorized role assignment." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered with this email." });
    }

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "AUTHOR",
    });

    // Hide password from response body
    newUser.password = undefined;
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Login Controller for existing users
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
      // logger.warn(`Login failed: User not found (${email})`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      // logger.warn(`Login failed: Incorrect password for user (${email})`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
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
      message: "Logged in successfully",
      Token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Simple profile route to test token validation
const getMe = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
};















//Change Password ----------------------------------------------------------------
//ForgetPassword Link ---------------------------------------------------------------- 
//Verify OTP Code separately ----------------------------------------------------------------
//Reset Password ----------------------------------------------------------------


module.exports = {
  signup,
  login,
  getMe,
};
