import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/product.js";

export const createOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  // 🔥 Atomic stock deduction
  const product = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true }
  );

  if (!product) {
    return res.status(400).json({
      message: "Insufficient stock or product not found",
    });
  }

  const totalPrice = product.price * quantity;

  const order = await Order.create({
    buyer: req.user._id,
    product: product._id,
    vendor: product.vendor,
    quantity,
    totalPrice,
  });

  res.status(201).json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Ownership check
  if (order.vendor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this order" });
  }

  const validTransitions = {
    processing: "shipped",
    shipped: "delivered",
  };

  if (validTransitions[order.status] !== status) {
    return res.status(400).json({
      message: `Invalid status transition from ${order.status} to ${status}`,
    });
  }

  order.status = status;
  await order.save();

  res.json(order);
};


export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate("product", "title price")
    .sort({ createdAt: -1 });

  res.json(orders);
};

export const getVendorOrders = async (req, res) => {
  const orders = await Order.find({ vendor: req.user._id })
    .populate("product", "title price")
    .populate("buyer", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
};