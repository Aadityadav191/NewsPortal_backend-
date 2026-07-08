const express = require("express");
const {
  createArticle,
  submitForReview,
  approveArticle,
  getPublicArticles,
  getArticleBySlug,
} = require("../controllers/article.controller.js");
const { upload } = require("../config/cloudinary.js");
const { createArticleImage } = require("../controllers/article.controller.js");
const { protect, restrictTo } = require("../middleware/auth.middleware.js");

const router = express.Router();

// Public routes 
router.get("/", getPublicArticles);
router.get("/:slug", getArticleBySlug);

//Middleware to protect routes below this line
router.use(protect);

// Author Routes
router.post("/CreateArticles", restrictTo("AUTHOR"),upload.single('featuredImage'), createArticle);
router.patch("/:id/submit", restrictTo("AUTHOR"), submitForReview);

// Admin/SuperAdmin Routes
router.patch("/:id/approve",restrictTo("ADMIN", "SUPER_ADMIN"),approveArticle,);

module.exports = router;
