import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductById
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("vendor"), upload.single("image"), createProduct);

router.get("/", getProducts);

router.get("/my-products", protect, authorize("vendor"), getMyProducts);

router.get("/:id", getProductById);
router.put("/:id", protect, authorize("vendor"), upload.single("image"), updateProduct);

router.delete("/:id", protect, authorize("vendor"), deleteProduct);

export default router;