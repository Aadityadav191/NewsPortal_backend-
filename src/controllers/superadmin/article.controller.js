const Article = require("../../models/article.models");
const logger = require("../../utils/logger");

// Get All Pending Articles

// ADMIN & SUPER_ADMIN
const PendingArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      status: "PENDING",
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    logger.error("Failed to fetch pending articles", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve / Reject Article
const updateArticleStatus = async (req, res) => {
  try {
    const { slug } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either APPROVED or REJECTED.",
      });
    }

    // Rejection reason is required if rejecting
    if (
      status === "REJECTED" &&
      (!rejectionReason || !rejectionReason.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required.",
      });
    }

    const article = await Article.findOne({ slug });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    // Prevent updating an already reviewed article
    if (article.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Article has already been ${article.status.toLowerCase()}.`,
      });
    }

    article.status = status;
    article.approvedBy = req.user.id;

    if (status === "APPROVED") {
      article.APPROVEDAt = new Date();
      article.rejectionReason = null;
    } else {
      article.APPROVEDAt = null;
      article.rejectionReason = rejectionReason.trim();
    }

    await article.save();

    const updatedArticle = await Article.findById(article._id)
      .populate("author", "name email")
      .populate("approvedBy", "name email role");

    return res.status(200).json({
      success: true,
      message: `Article ${status.toLowerCase()} successfully.`,
      article: updatedArticle,
    });
  } catch (error) {
    logger.error("Failed to update article status", {
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
  PendingArticles,
  updateArticleStatus,
};
