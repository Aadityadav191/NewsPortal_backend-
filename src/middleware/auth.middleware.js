const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");
const { promisify } = require("util");
const { hashPassword, comparePassword } = require("../utils/password.js");
const generateToken = require("../utils/jwt.js");

// Middleware to protect routes Verify if the user is logged in

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({
          message: "You are not logged in. Please log in to get access.",
        });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: "fail", message: "Invalid token. Access denied." });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to perform this action.",
        });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
