// =================================================================
// Cart Routes - API endpoints for cart operations
// =================================================================

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { 
  getCart, 
  addItemToCart, 
  updateCartItem, 
  removeItemFromCart, 
  clearCart,
  getCartSummary
} from "../controllers/cart.controller.js";

const router = express.Router();

// Apply authentication middleware to all cart routes
router.use(protect);

// Cart routes
router.route("/")                   // Cart management
  .get(getCart)                    // Get user's cart
  .delete(clearCart);              // Clear entire cart

router.get("/summary", getCartSummary); // Get cart summary

router.route("/items")             // Cart items management
  .post(addItemToCart)             // Add item to cart
  .put(updateCartItem);            // Update item quantity

router.delete("/items/:productId", removeItemFromCart); // Remove item from cart

export default router;