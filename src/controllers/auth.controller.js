const User = require("../models/user.models");
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const logger = require("../utils/logger");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user by email (all roles)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Role based validation
    switch (user.role) {
      // SUPER ADMIN
      case "SUPER_ADMIN":
        if (user.status !== "APPROVED") {
          return res.status(403).json({
            success: false,
            message: "Super Admin account is not approved.",
          });
        }

        if (!user.isActive) {
          return res.status(403).json({
            success: false,
            message: "Super Admin account is inactive.",
          });
        }

        break;

      // ADMIN
      case "ADMIN":
        if (user.status === "PENDING") {
          return res.status(403).json({
            success: false,
            message: "Your account is awaiting Super Admin approval.",
          });
        }

        if (user.status === "REJECTED") {
          return res.status(403).json({
            success: false,
            message: "Your account request has been rejected.",
          });
        }

        if (!user.isActive) {
          return res.status(403).json({
            success: false,
            message: "Your account has been deactivated.",
          });
        }

        break;

      // AUTHOR
      case "AUTHOR":
        if (user.status !== "APPROVED") {
          return res.status(403).json({
            success: false,
            message: "Your account has not been approved yet.",
          });
        }

        if (!user.isActive) {
          return res.status(403).json({
            success: false,
            message: "Your account is inactive. Please contact administrator.",
          });
        }

        break;

      default:
        return res.status(403).json({
          success: false,
          message: "Invalid user role.",
        });
    }

    // Generate JWT
    const token = generateToken(user);

    // Remove password
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: `${user.role} logged in successfully.`,
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error("Login failed", {
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
  loginController,
};
