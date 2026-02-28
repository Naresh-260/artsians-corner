import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middlewares/auth.middleware.js";
import { authorize } from "./middlewares/role.middleware.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();   

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

app.get("/api/vendor-test", protect, authorize("vendor"), (req, res) => {
  res.json({ message: "Vendor access granted" });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;