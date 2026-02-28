// =================================================================
// Cart Controller - Handles cart-related operations
// =================================================================

import Cart from "../models/cart.js";
import Product from "../models/product.js";

/**
 * Get user's cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.getOrCreate(req.user._id);
    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Error retrieving cart", error: error.message });
  }
};

/**
 * Add item to cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Validate input
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    
    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Only ${product.stock} items available.` 
      });
    }
    
    // Get or create user's cart
    const cart = await Cart.getOrCreate(req.user._id);
    
    // Add item to cart
    await cart.addItem(product, quantity);
    
    // Populate the updated cart with product details
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Add item to cart error:", error);
    res.status(500).json({ message: "Error adding item to cart", error: error.message });
  }
};

/**
 * Update item quantity in cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    // Check if product exists and has sufficient stock (if increasing quantity)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const existingItem = cart.items.find(
      item => item.product.toString() === productId.toString()
    );
    
    if (existingItem && quantity > 0) {
      const quantityDifference = quantity - existingItem.quantity;
      
      if (quantityDifference > 0 && product.stock < quantityDifference) {
        return res.status(400).json({ 
          message: `Insufficient stock. Only ${product.stock} more items available.` 
        });
      }
    }
    
    // Update item quantity
    await cart.updateItemQuantity(productId, quantity);
    
    // Populate the updated cart with product details
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ message: "Error updating cart item", error: error.message });
  }
};

/**
 * Remove item from cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    // Remove item from cart
    await cart.removeItem(productId);
    
    // Populate the updated cart with product details
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Remove item from cart error:", error);
    res.status(500).json({ message: "Error removing item from cart", error: error.message });
  }
};

/**
 * Clear entire cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const clearCart = async (req, res) => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    // Clear the cart
    await cart.clearCart();
    
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};

/**
 * Get cart summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(200).json({
        totalItems: 0,
        subtotal: 0,
        itemCount: 0
      });
    }
    
    res.status(200).json({
      totalItems: cart.getTotalItems(),
      subtotal: cart.subtotal,
      itemCount: cart.items.length
    });
  } catch (error) {
    console.error("Get cart summary error:", error);
    res.status(500).json({ message: "Error retrieving cart summary", error: error.message });
  }
};