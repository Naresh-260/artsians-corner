// =================================================================
// Cart Service - API functions for cart operations
// =================================================================

import axiosInstance from "./axiosInstance";

/**
 * Get user's cart
 * @returns {Promise} - API response with cart data
 */
export const getCart = () => {
  return axiosInstance.get("/cart");
};

/**
 * Add item to cart
 * @param {Object} data - Cart item data {productId, quantity}
 * @returns {Promise} - API response
 */
export const addToCart = (data) => {
  return axiosInstance.post("/cart/items", data);
};

/**
 * Update cart item quantity
 * @param {Object} data - Update data {productId, quantity}
 * @returns {Promise} - API response
 */
export const updateCartItem = (data) => {
  return axiosInstance.put("/cart/items", data);
};

/**
 * Remove item from cart
 * @param {string} productId - ID of product to remove
 * @returns {Promise} - API response
 */
export const removeFromCart = (productId) => {
  return axiosInstance.delete(`/cart/items/${productId}`);
};

/**
 * Clear entire cart
 * @returns {Promise} - API response
 */
export const clearCart = () => {
  return axiosInstance.delete("/cart");
};

/**
 * Get cart summary
 * @returns {Promise} - API response with summary data
 */
export const getCartSummary = () => {
  return axiosInstance.get("/cart/summary");
};