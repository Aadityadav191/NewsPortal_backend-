const express = require("express");
const { createArticle, editArticle } = require("../controllers/author/article.controller.js");
const { protect, restrictTo } = require("../middleware/auth.middleware.js");
const upload = require("../middleware/upload.middleware.js");
const { authorsignup } = require("../controllers/author/auth.controller.js");
const router = express.Router();


router.post("/signup",authorsignup);

//Protected Routes
router.use(protect);

router.use(restrictTo("AUTHOR"))

//Create Article Route
router.post("/create-article",upload.single("featuredImage"),createArticle,);

// router.get("/edit-article/:slug", restrictTo("ADMIN"), editArticle);


module.exports = router;
