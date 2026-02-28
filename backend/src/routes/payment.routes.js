// =================================================================
// Payment Routes - API endpoints for payment operations
// =================================================================

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { 
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  getPaymentStatus,
  refundPayment
} from "../controllers/payment.controller.js";

const router = express.Router();

// Apply authentication middleware to all payment routes
router.use(protect);

// Payment routes
router.post("/create-order", createPaymentOrder);    // Create payment order
router.post("/verify", verifyPaymentAndCreateOrder);  // Verify payment and create order
router.get("/status/:paymentId", getPaymentStatus);   // Get payment status
router.post("/refund", refundPayment);              // Process refund

export default router;