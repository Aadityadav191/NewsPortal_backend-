const User = require("../../models/user.models.js");
const logger = require("../../utils/logger.js");

// Get All Pending Authors
const PendingAuthors = async (req, res) => {
  try {
    const pendingAuthors = await User.find({
      role: "AUTHOR",
      status: "PENDING",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: pendingAuthors.length,
      authors: pendingAuthors,
    });
  } catch (error) {
    logger.error("Failed to fetch pending authors", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAuthorStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; 

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const author = await User.findById(userId);

    if (!author || author.role !== "AUTHOR") {
      return res.status(404).json({
        success: false,
        message: "Author not found.",
      });
    }

    author.status = status;
    author.isActive = status === "APPROVED";

    await author.save();

    return res.status(200).json({
      success: true,
      message: `Author ${status.toLowerCase()} successfully.`,
      author,
    });

  } catch (error) {
    logger.error("Update author status failed", {
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
  PendingAuthors,
  updateAuthorStatus
};
