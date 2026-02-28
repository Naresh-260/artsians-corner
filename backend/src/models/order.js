// =================================================================
// Order Model - Represents customer orders in the system
// =================================================================

import mongoose from "mongoose";

/**
 * Order Schema Definition
 * Defines the structure and validation rules for order documents
 */
const orderSchema = new mongoose.Schema(
  {
    // Reference to the buyer (customer who placed the order)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
      index: true // Index for faster buyer-specific queries
    },
    
    // Reference to the ordered product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true // Index for faster product-specific queries
    },
    
    // Reference to the vendor (product owner)
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],
      index: true // Index for faster vendor-specific queries
    },
    
    // Quantity of products ordered
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number"
      }
    },
    
    // Total price for the order (quantity × product price)
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"]
    },
    
    // Current status of the order
    status: {
      type: String,
      enum: {
        values: ["processing", "shipped", "delivered", "cancelled"],
        message: "{VALUE} is not a valid order status"
      },
      default: "processing",
      index: true // Index for faster status-based queries
    }
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// =================================================================
// Indexes for Performance
// =================================================================

// Compound index for common query patterns
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ vendor: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

// =================================================================
// Instance Methods
// =================================================================

/**
 * Update order status
 * @param {string} newStatus - New status to set
 * @returns {Promise} - Updated order document
 */
orderSchema.methods.updateStatus = async function(newStatus) {
  const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  
  // Business logic for status transitions
  const statusFlow = {
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: [],
    cancelled: []
  };
  
  if (!statusFlow[this.status].includes(newStatus)) {
    throw new Error(`Cannot change status from ${this.status} to ${newStatus}`);
  }
  
  this.status = newStatus;
  return await this.save();
};

/**
 * Check if order can be cancelled
 * @returns {boolean} - True if order can be cancelled
 */
orderSchema.methods.canBeCancelled = function() {
  return this.status === "processing" || this.status === "shipped";
};

// =================================================================
// Static Methods
// =================================================================

/**
 * Find orders by buyer
 * @param {string} buyerId - Buyer's user ID
 * @param {string} status - Optional status filter
 * @returns {Promise} - Array of orders
 */
orderSchema.statics.findByBuyer = function(buyerId, status = null) {
  const query = { buyer: buyerId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

/**
 * Find orders by vendor
 * @param {string} vendorId - Vendor's user ID
 * @param {string} status - Optional status filter
 * @returns {Promise} - Array of orders
 */
orderSchema.statics.findByVendor = function(vendorId, status = null) {
  const query = { vendor: vendorId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

/**
 * Get order statistics for a vendor
 * @param {string} vendorId - Vendor's user ID
 * @returns {Promise} - Order statistics object
 */
orderSchema.statics.getVendorStats = async function(vendorId) {
  const stats = await this.aggregate([
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" }
      }
    }
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = { count: stat.count, revenue: stat.totalRevenue };
    return acc;
  }, {});
};

// =================================================================
// Create and Export Model
// =================================================================

const Order = mongoose.model("Order", orderSchema);

export default Order;