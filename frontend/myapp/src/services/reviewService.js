// =================================================================
// Review Service - API functions for review operations
// =================================================================

import axiosInstance from "./axiosInstance";

/**
 * Create a review for a product
 * @param {Object} data - Review data {productId, rating, title, comment}
 * @returns {Promise} - API response with created review
 */
export const createReview = (data) => {
  const { productId, ...rest } = data;
  return axiosInstance.post(`/reviews/product/${productId}`, rest);
};
/**
 * Get reviews for a product
 * @param {string} productId - Product ID
 * @param {Object} params - Query parameters {page, limit, sortBy}
 * @returns {Promise} - API response with reviews
 */
export const getProductReviews = (productId, params = {}) => {
  return axiosInstance.get(`/reviews/product/${productId}`, { params });
};

/**
 * Get average rating for a product
 * @param {string} productId - Product ID
 * @returns {Promise} - API response with rating
 */
export const getProductRating = (productId) => {
  return axiosInstance.get(`/reviews/product/${productId}/rating`);
};

/**
 * Update a review
 * @param {string} reviewId - Review ID
 * @param {Object} data - Update data {rating, title, comment}
 * @returns {Promise} - API response
 */
export const updateReview = (reviewId, data) => {
  return axiosInstance.put(`/reviews/${reviewId}`, data);
};

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 * @returns {Promise} - API response
 */
export const deleteReview = (reviewId) => {
  return axiosInstance.delete(`/reviews/${reviewId}`);
};

/**
 * Vote on a review
 * @param {string} reviewId - Review ID
 * @param {Object} data - Vote data {helpful}
 * @returns {Promise} - API response
 */
export const voteOnReview = (reviewId, data) => {
  return axiosInstance.post(`/reviews/${reviewId}/vote`, data);
};

/**
 * Get reviews by current user
 * @param {Object} params - Query parameters {page, limit, sortBy}
 * @returns {Promise} - API response with user's reviews
 */
export const getUserReviews = (params = {}) => {
  return axiosInstance.get("/reviews/user", { params });
};