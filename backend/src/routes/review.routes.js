import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createReview, getProductReviews, getProductRating,
  updateReview, deleteReview, voteOnReview, getUserReviews
} from "../controllers/review.controller.js";

const router = express.Router();

// ── Public routes (no auth needed) ──────────────────────────────
router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/rating", getProductRating);

// ── Protected routes (auth required) ────────────────────────────
router.post("/product/:productId", protect, createReview);
router.get("/user", protect, getUserReviews);
router.put("/:reviewId", protect, updateReview);
router.delete("/:reviewId", protect, deleteReview);
router.post("/:reviewId/vote", protect, voteOnReview);

export default router;