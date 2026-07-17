const User = require("../../models/user.models.js");
const generateToken = require("../../utils/jwt.js");
const { hashPassword, comparePassword } = require("../../utils/password.js");
const logger = require("../../utils/logger.js");

 
// Author Signup
const authorsignup = async (req, res) => {
  try {
    const { name, email, password , } = req.body;
    if (!name || !email || !password ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered with this email.",
      });
    }

    const hashedPassword = await hashPassword(password);

    // Create AUTHOR only
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "AUTHOR",
      status: "PENDING",
      isActive: false,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please wait for admin approval before logging in.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    logger.error("Author signup failed", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 
// Author Login
const authorlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    // Find only AUTHOR
    const author = await User.findOne({
      email,
      role: "AUTHOR",
    }).select("+password");

    if (!author) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Compare password
    const isMatch = await comparePassword(password, author.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Check approval
    if (author.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Your account has not been approved yet to Login.",
      });
    }

    // Check active status
    if (!author.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact the administrator.",
      });
    }

    // Generate JWT
    const token = generateToken(author);

    author.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: {
        _id: author._id,
        name: author.name,
        email: author.email,
        role: author.role,
        status: author.status,
        isActive: author.isActive,
      },
    });
  } catch (error) {
    logger.error("Author login failed", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  authorsignup,
  authorlogin,
};
