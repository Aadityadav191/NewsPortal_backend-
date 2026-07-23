const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    featuredImage: {
      type: String, 
      required: [true, 'Featured image is required'],
    },
    category: {
      type: String,
      required: [true, 'Article category is required'],
      enum: [
        'FINANCE',
        'POLITICS',
        'ENTERTAINMENT',
        'SPORTS',
        'TECHNOLOGY',
        'BUSINESS',
        'HEALTH',
        'SCIENCE',
        'EDUCATION',
        'LIFESTYLE',
        'TRAVEL',
        'WORLD',
      ],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Establishes relationship to the User model
      required: [true, 'An article must belong to an author'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null, // Filled only if status changes to 'REJECTED'
    },
    APPROVEDAt: {
      type: Date,
      default: null, // Set dynamically when status changes to 'APPROVED'
    },
  },
  {
    timestamps: true,
  }
);

// Database Optimization: Indexing for fast public lookups
// News sites fetch APPROVED articles constantly; indexing slug and status keeps things blazing fast.
articleSchema.index({ status: 1, APPROVEDAt: -1 });

module.exports =
  mongoose.models.Article || mongoose.model('Article', articleSchema);