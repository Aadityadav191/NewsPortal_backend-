const User = require("../../models/user.models");
const logger = require("../../utils/logger");

// Get All Pending Admins SUPER_ADMIN Only

const PendingAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: "ADMIN",
      status: "PENDING",
    })
      .select("-password")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      Total_Pending: admins.length,
      admins,
    });
  } catch (error) {
    logger.error("Failed to fetch pending admins", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Approve / Reject Admin
// SUPER_ADMIN Only
const updateAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either APPROVED or REJECTED.",
      });
    }

    const admin = await User.findById(userId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    if (admin.role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not an admin.",
      });
    }

    if (admin.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Admin has already been ${admin.status.toLowerCase()}.`,
      });
    }

    admin.status = status;
    admin.isActive = status === "APPROVED";

    await admin.save();

    return res.status(200).json({
      success: true,
      message: `Admin ${status.toLowerCase()} successfully.`,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        isActive: admin.isActive,
      },
    });

  } catch (error) {
    logger.error("Failed to update admin status", {
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
  PendingAdmins,
  updateAdminStatus,
};