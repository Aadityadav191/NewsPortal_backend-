const User = require("../models/user.models.js");
require("dotenv").config();

// Get all users------------------------------------------------------------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "Success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({ 
        status: "fail",
        message: error.message 
    });
  }
};



// Get a single user by ID----------------------------------------------------------------
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
//   updateUser,
//   deleteUser,
};