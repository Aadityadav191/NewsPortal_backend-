const express = require("express");
const router = express.Router();

const {
  adminsignup,
  adminlogin,
} = require("../controllers/admin/auth.controller.js");

const {
  updateAuthorStatus,
  PendingAuthors,
} = require("../controllers/superadmin/author.controller.js");

const { protect, restrictTo } = require("../middleware/auth.middleware.js");
const {
  updateArticleStatus,
  PendingArticles,
} = require("../controllers/superadmin/article.controller.js");

// Public Routes
router.post("/signup", adminsignup);
router.post("/login", adminlogin);

// Protected Routes
router.use(protect);

//--------------------- Only For SUPER_ADMIN And ADMIN ---------------------

router.use(restrictTo("ADMIN", "SUPER_ADMIN"));

router.get("/pending-author", PendingAuthors);
router.patch("/approve-author/:userId", updateAuthorStatus);

router.get("/pending-articles", PendingArticles);
router.patch("/approve-articles/:articleslug", updateArticleStatus);

module.exports = router;
