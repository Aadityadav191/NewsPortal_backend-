const User = require("../../models/user.models.js");
const generateToken = require("../../utils/jwt.js");
const { comparePassword } = require("../../utils/password.js");
const logger = require("../../utils/logger.js");

// Super Admin Login
const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find only SUPER_ADMIN
    const superAdmin = await User.findOne({
      email,
      role: "SUPER_ADMIN",
    }).select("+password");

    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Check password
    const isMatch = await comparePassword(password, superAdmin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Check status
    if (superAdmin.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Super Admin account is not approved.",
      });
    }

    // Check active
    if (!superAdmin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Super Admin account is inactive.",
      });
    }

    // Generate token
    const token = generateToken(superAdmin);

    superAdmin.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Super Admin logged in successfully.",
      token,
      user: {
        _id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
      },
    });
  } catch (error) {
    console.log(error)
    logger.error("Super Admin login failed", {
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
  superAdminLogin,
};
