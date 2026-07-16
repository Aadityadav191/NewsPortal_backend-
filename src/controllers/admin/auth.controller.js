const User = require("../../models/user.models.js");
const generateToken = require("../../utils/jwt.js");
const { hashPassword, comparePassword } = require("../../utils/password.js");
const logger = require("../../utils/logger.js");

  
// Admin Signup
const adminsignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      status: "PENDING",
      isActive: false,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please wait for Super Admin approval.",
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    logger.error("Admin signup failed", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  
// Admin Login
const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    const admin = await User.findOne({
      email,
      role: "ADMIN",
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    if (admin.status === "PENDING") {
      return res.status(403).json({
        success: false,
        message: "Your account is awaiting Super Admin approval.",
      });
    }

    if (admin.status === "REJECTED") {
      return res.status(403).json({
        success: false,
        message: "Your account request has been rejected.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    const token = generateToken({
      id: admin._id,
      role: admin.role,
    });

    admin.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully.",
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    logger.error("Admin login failed", {
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
  adminsignup,
  adminlogin,
};
