import express from "express";
import { getVendorAnalytics } from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Get vendor analytics data
router.get("/vendor", protect, authorize("vendor"), getVendorAnalytics);

export default router;