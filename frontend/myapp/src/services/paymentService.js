// =================================================================
// Payment Service - API functions for payment operations
// =================================================================

import axiosInstance from "./axiosInstance";

/**
 * Create a payment order
 * @param {Object} data - Payment data {amount, currency, receipt}
 * @returns {Promise} - API response with payment order
 */
export const createPaymentOrder = async (data) => {
  console.log("Payment service: Creating payment order with data:", data);
  try {
    const response = await axiosInstance.post("/payments/create-order", data);
    console.log("Payment service: Response received:", response);
    return response;
  } catch (error) {
    console.error("Payment service: Error creating payment order:", error);
    throw error;
  }
};

/**
 * Verify payment and create order
 * @param {Object} data - Verification data {razorpay_order_id, razorpay_payment_id, razorpay_signature}
 * @returns {Promise} - API response
 */
export const verifyPaymentAndCreateOrder = (data) => {
  return axiosInstance.post("/payments/verify", data);
};

/**
 * Get payment status
 * @param {string} paymentId - Payment ID
 * @returns {Promise} - API response with payment status
 */
export const getPaymentStatus = (paymentId) => {
  return axiosInstance.get(`/payments/status/${paymentId}`);
};

/**
 * Process refund
 * @param {Object} data - Refund data {paymentId, amount, reason}
 * @returns {Promise} - API response
 */
export const processRefund = (data) => {
  return axiosInstance.post("/payments/refund", data);
};