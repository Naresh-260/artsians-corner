import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
    index: true
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1 star"],
    max: [5, "Rating cannot exceed 5 stars"],
    validate: {
      validator: Number.isInteger,
      message: "Rating must be a whole number"
    }
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, "Comment cannot exceed 1000 characters"]
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  totalVotes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// ── Indexes ────────────────────────────────────────────────────────
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// ── Instance Methods ───────────────────────────────────────────────
reviewSchema.methods.updateVote = async function(helpful) {
  this.totalVotes += 1;
  if (helpful) this.helpfulVotes += 1;
  return await this.save();
};

// ── Static Methods ─────────────────────────────────────────────────
reviewSchema.statics.getAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } }
  ]);
  return result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;
};

reviewSchema.statics.getReviewCount = async function(productId) {
  return await this.countDocuments({ product: productId });
};

reviewSchema.statics.getProductReviews = async function(productId, options = {}) {
  const { page = 1, limit = 10, sortBy = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  const reviews = await this.find({ product: productId })
    .populate("user", "name")
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ product: productId });

  return {
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalReviews: total
  };
};

reviewSchema.statics.getUserReviews = async function(userId, options = {}) {
  const { page = 1, limit = 10, sortBy = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  const reviews = await this.find({ user: userId })
    .populate("product", "title image")
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ user: userId });

  return {
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalReviews: total
  };
};

// NOTE: Pre-save hook removed — duplicate review checking is handled
// in the controller before calling review.save()

const Review = mongoose.model("Review", reviewSchema);

export default Review;