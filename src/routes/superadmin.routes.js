const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../middleware/auth.middleware.js");
const {
  updateAuthorStatus,
  PendingAuthors,
} = require("../controllers/superadmin/author.controller.js");
const {
  PendingArticles,
  updateArticleStatus,
} = require("../controllers/superadmin/article.controller.js");
const {
  PendingAdmins,
  updateAdminStatus,
} = require("../controllers/superadmin/admin.controller.js");
const { loginController } = require("../controllers/auth.Controller.js");

// Public
router.post("/login", loginController);

// Protected routes allow only after Login
router.use(protect);

//--------------------- Only For Superadmin ---------------------

router.use(restrictTo("SUPER_ADMIN"));

router.get("/pending-admins", PendingAdmins);
router.patch("/approve-admin/:userId", updateAdminStatus);

module.exports = router;
