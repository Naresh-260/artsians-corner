// =================================================================
// Review Controller - Handles review and rating operations
// =================================================================

import Review from "../models/review.js";
import Product from "../models/product.js";

/**
 * Create a new review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createReview = async (req, res) => {
  try {
   const { productId } = req.params;
  const { rating, title, comment } = req.body;
    
    // Validate input
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });
    
    if (existingReview) {
      return res.status(409).json({ message: "You have already reviewed this product" });
    }
    
    // Create the review
    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      title,
      comment,
      verifiedPurchase: false // This would be true if the user actually purchased the product
    });
    
    await review.save();
    
    // Populate user info for response
    const populatedReview = await Review.findById(review._id).populate('user', 'name');
    
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

/**
 * Get reviews for a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = '-createdAt' } = req.query;
    
    // Validate product ID
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Get reviews with pagination
    const result = await Review.getProductReviews(productId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ message: "Error retrieving reviews", error: error.message });
  }
};

/**
 * Get average rating for a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProductRating = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Validate product ID
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Get average rating
    const averageRating = await Review.getAverageRating(productId);
    const reviewCount = await Review.getReviewCount(productId);
    
    res.status(200).json({
      averageRating,
      reviewCount,
      productId
    });
  } catch (error) {
    console.error("Get product rating error:", error);
    res.status(500).json({ message: "Error retrieving rating", error: error.message });
  }
};

/**
 * Update a review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    
    // Validate input
    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }
    
    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }
    
    // Update fields if provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }
    
    if (title !== undefined) {
      review.title = title;
    }
    
    if (comment !== undefined) {
      review.comment = comment;
    }
    
    await review.save();
    
    // Populate user info for response
    const populatedReview = await Review.findById(review._id).populate('user', 'name');
    
    res.status(200).json(populatedReview);
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

/**
 * Delete a review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    // Validate review ID
    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }
    
    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }
    
    await Review.findByIdAndDelete(reviewId);
    
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};

/**
 * Vote on a review (mark as helpful/not helpful)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const voteOnReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body;
    
    // Validate input
    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }
    
    if (helpful === undefined) {
      return res.status(400).json({ message: "Helpful value is required (true/false)" });
    }
    
    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Update vote
    await review.updateVote(helpful);
    
    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Vote on review error:", error);
    res.status(500).json({ message: "Error voting on review", error: error.message });
  }
};

/**
 * Get reviews by current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = '-createdAt' } = req.query;
    
    // Get reviews with pagination
    const result = await Review.getUserReviews(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({ message: "Error retrieving user reviews", error: error.message });
  }
};