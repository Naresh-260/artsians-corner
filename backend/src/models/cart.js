// =================================================================
// Cart Model - Represents user shopping carts
// =================================================================

import mongoose from "mongoose";

/**
 * Cart Item Schema Definition
 * Defines the structure for individual items in a cart
 */
const cartItemSchema = new mongoose.Schema({
  // Reference to the product
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
    index: true
  },
  
  // Quantity of this product in the cart
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be a whole number"
    }
  },
  
  // Price at time of adding to cart (to handle price changes)
  priceAtAddition: {
    type: Number,
    required: [true, "Price at addition is required"],
    min: [0, "Price cannot be negative"]
  }
});

/**
 * Cart Schema Definition
 * Defines the structure and validation rules for cart documents
 */
const cartSchema = new mongoose.Schema({
  // Reference to the user who owns this cart
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
    unique: true, // Each user can have only one cart
    index: true
  },
  
  // Array of cart items
  items: [cartItemSchema],
  
  // Calculated subtotal (sum of all item prices × quantities)
  subtotal: {
    type: Number,
    default: 0,
    min: [0, "Subtotal cannot be negative"]
  },
  
  // Last updated timestamp (for cache invalidation)
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// =================================================================
// Indexes for Performance
// =================================================================

// Index on user for fast cart retrieval
cartSchema.index({ user: 1 });

// =================================================================
// Instance Methods
// =================================================================

/**
 * Add item to cart
 * @param {Object} product - Product document
 * @param {number} quantity - Quantity to add
 * @returns {Promise} - Updated cart document
 */
cartSchema.methods.addItem = async function(product, quantity = 1) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === product._id.toString()
  );
  
  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      product: product._id,
      quantity: quantity,
      priceAtAddition: product.price
    });
  }
  
  await this.calculateSubtotal();
  return await this.save();
};

/**
 * Remove item from cart
 * @param {string} productId - ID of product to remove
 * @returns {Promise} - Updated cart document
 */
cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  
  await this.calculateSubtotal();
  return await this.save();
};

/**
 * Update item quantity in cart
 * @param {string} productId - ID of product to update
 * @param {number} quantity - New quantity
 * @returns {Promise} - Updated cart document
 */
cartSchema.methods.updateItemQuantity = async function(productId, quantity) {
  if (quantity <= 0) {
    return await this.removeItem(productId);
  }
  
  const item = this.items.find(
    item => item.product.toString() === productId.toString()
  );
  
  if (item) {
    item.quantity = quantity;
    await this.calculateSubtotal();
    return await this.save();
  }
  
  throw new Error("Item not found in cart");
};

/**
 * Calculate and update subtotal
 * @returns {Promise} - Updated cart document
 */
cartSchema.methods.calculateSubtotal = async function() {
  this.subtotal = this.items.reduce((total, item) => {
    return total + (item.priceAtAddition * item.quantity);
  }, 0);
  
  this.lastUpdated = new Date();
  return this;
};

/**
 * Get cart total items count
 * @returns {number} - Total number of items in cart
 */
cartSchema.methods.getTotalItems = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Clear entire cart
 * @returns {Promise} - Updated cart document
 */
cartSchema.methods.clearCart = async function() {
  this.items = [];
  this.subtotal = 0;
  this.lastUpdated = new Date();
  return await this.save();
};

// =================================================================
// Static Methods
// =================================================================

/**
 * Get or create user's cart
 * @param {string} userId - User's ID
 * @returns {Promise} - Cart document
 */
cartSchema.statics.getOrCreate = async function(userId) {
  let cart = await this.findOne({ user: userId });
  
  if (!cart) {
    cart = await this.create({ user: userId });
  }
  
  return cart.populate('items.product');
};

// =================================================================
// Create and Export Model
// =================================================================

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;