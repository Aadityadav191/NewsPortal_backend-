const Article = require("../../models/Article.models");

// Author creates a new article
const createArticle = async (req, res) => {
  try {
    const { title, content, featuredImage, category } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Content is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a featured image banner.",
      });
    }

    if (!category) {
        return res.status(400).json({
          message: "Please fill category Section.",
        });
      }

    // Generate slug
    const slug = `${title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now()}`;

    const existingArticle = await Article.findOne({
      title: title.trim(),
      author: req.user.id,
      status: "PENDING",
    });
    if (existingArticle) {
      return res.status(409).json({
        message: "You already have an article with this title.",
      });
    }

    // Save article
    const article = await Article.create({
      title: title.trim(),
      slug,
      content: content.trim(),
      featuredImage: req.file.path,
      author: req.user.id,
      status: "PENDING",
    });

    const populatedArticle = await Article.findById(article._id).populate(
      "author",
      "name",
    );

    return res.status(201).json({
      success: true,
      message: "Article created successfully and sent for review!",
      data: populatedArticle,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create article.",
      error: error.message,
    });
  }
};

// // Author submits PENDING for review
// const submitForReview = async (req, res) => {
//   try {
//     const article = await Article.findOneAndUpdate(
//       { _id: req.params.id, author: req.user.id, status: "PENDING" },
//       { status: "PENDING" },
//       { new: true },
//     );

//     if (!article) {
//       return res.status(404).json({ message: "Article not found" });
//     }
//     const populatedArticle = await article.populate("author", "name");
//     res.status(200).json({
//       message: "Submitted for review successfully",
//       article: populatedArticle,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //Get all APPROVED articles
// const getPublicArticles = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     //query for status: 'APPROVED'
//     const articles = await Article.find({ status: "APPROVED" })
//       .select("title slug featuredImage APPROVEDAt summary")
//       .populate("author", "name")
//       .sort({ APPROVEDAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const totalArticles = await Article.countDocuments({ status: "APPROVED" });

//     res.status(200).json({
//       page,
//       totalPages: Math.ceil(totalArticles / limit),
//       results: articles.length,
//       data: articles,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single APPROVED article by slug
// const getArticleBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const article = await Article.findOne({
//       slug,
//       status: "APPROVED",    //Not Showing to unAPPROVED articles i.e. PENDING or PENDING
//     }).populate("author", "name");

//     if (!article) {
//       return res.status(404).json({ message: "Article not found" });
//     }

//     res.status(200).json({ data: article });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = {
  createArticle,
  // submitForReview,
  // getPublicArticles,
  // getArticleBySlug,
};
