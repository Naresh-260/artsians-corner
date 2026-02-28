import Product from "../models/product.js";

// Create product (vendor only)
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
export const createProduct = async (req, res) => {
  try {
    const { title, price, description, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      title,
      price,
      description,
      stock,
      image: result.secure_url,
      imagePublicId: result.public_id,
      vendor: req.user._id,
    });

    res.status(201).json(product);

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// Get all products (public)
export const getProducts = async (req, res) => {
  const products = await Product.find().populate("vendor", "name email");
  res.json(products);
};


export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 🔥 Ownership check
  if (product.vendor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this product" });
  }

  const { title, description, price, stock } = req.body;

  product.title = title || product.title;
  product.description = description || product.description;
  product.price = price || product.price;
  product.stock = stock || product.stock;

  // Handle image update
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    product.image = result.secure_url;
    product.imagePublicId = result.public_id;
  }

  const updatedProduct = await product.save();

  res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 🔥 Ownership check
  if (product.vendor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this product" });
  }

  await product.deleteOne();

  res.json({ message: "Product removed successfully" });
};

export const getMyProducts = async (req, res) => {
  const products = await Product.find({ vendor: req.user._id });
  res.json(products);
};


// Add this function:
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("vendor", "name email");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};