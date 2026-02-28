// =================================================================
// Product Model - Represents products in the marketplace
// =================================================================

import mongoose from "mongoose";

/**
 * Product Schema Definition
 * Defines the structure and validation rules for product documents
 */
const productSchema = new mongoose.Schema(
  {
    // Product title/name
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    
    // Product description
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    
    // Product price (in USD)
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function(value) {
          return value >= 0;
        },
        message: "Price must be a positive number"
      }
    },
    
    // Available stock quantity
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      default: 0,
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number"
      }
    },
    
    // Product image URL (Cloudinary)
    image: {
      type: String,
      trim: true
    },
    
    // Cloudinary public ID for image management
    imagePublicId: {
      type: String,
      trim: true
    },
    
    // Reference to the vendor (user who created the product)
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],

    }
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// =================================================================
// Indexes for Performance
// =================================================================

// Create index on vendor for faster vendor-specific queries
productSchema.index({ vendor: 1 });

// Create index on createdAt for sorting by date
productSchema.index({ createdAt: -1 });

// =================================================================
// Instance Methods
// =================================================================

/**
 * Check if product is in stock
 * @returns {boolean} - True if stock > 0
 */
productSchema.methods.isInStock = function() {
  return this.stock > 0;
};

/**
 * Update stock quantity
 * @param {number} quantity - Amount to reduce stock by
 * @returns {Promise} - Updated product document
 */
productSchema.methods.updateStock = async function(quantity) {
  if (this.stock >= quantity) {
    this.stock -= quantity;
    return await this.save();
  } else {
    throw new Error("Insufficient stock");
  }
};

// =================================================================
// Static Methods
// =================================================================

/**
 * Find products by vendor
 * @param {string} vendorId - Vendor's user ID
 * @returns {Promise} - Array of products
 */
productSchema.statics.findByVendor = function(vendorId) {
  return this.find({ vendor: vendorId }).sort({ createdAt: -1 });
};

/**
 * Find products in stock
 * @returns {Promise} - Array of products with stock > 0
 */
productSchema.statics.findInStock = function() {
  return this.find({ stock: { $gt: 0 } }).sort({ createdAt: -1 });
};

// =================================================================
// Create and Export Model
// =================================================================

const Product = mongoose.model("Product", productSchema);

export default Product;