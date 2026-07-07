import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Establishes relationship to the User model
      required: [true, 'An article must belong to an author'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'REJECTED'],
      default: 'DRAFT',
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
    publishedAt: {
      type: Date,
      default: null, // Set dynamically when status changes to 'PUBLISHED'
    },
  },
  {
    timestamps: true,
  }
);

// Database Optimization: Indexing for fast public lookups
// News sites fetch published articles constantly; indexing slug and status keeps things blazing fast.
articleSchema.index({ status: 1, publishedAt: -1 });

const Article = mongoose.model('Article', articleSchema);
export default Article;