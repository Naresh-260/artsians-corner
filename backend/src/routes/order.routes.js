import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { updateOrderStatus } from "../controllers/order.controller.js";
import { getMyOrders } from "../controllers/order.controller.js";
import { getVendorOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, authorize("buyer"), createOrder);
router.get("/my-orders", protect, authorize("buyer"), getMyOrders);
router.get("/vendor-orders", protect, authorize("vendor"), getVendorOrders);
router.put("/:id/status", protect, authorize("vendor"), updateOrderStatus);

export default router;