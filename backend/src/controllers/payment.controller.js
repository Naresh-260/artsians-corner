// =================================================================
// Razorpay Payment Controller - Handles payment processing
// =================================================================

import Razorpay from 'razorpay';
import crypto from 'crypto';
import Cart from '../models/cart.js';
import Order from '../models/order.js';
import Product from '../models/product.js';

// Lazy Razorpay initializer - reads env vars at call time, not at module load time
const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a payment order
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = cart.subtotal;

    if (totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid cart total' });
    }

    const options = {
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-10)}`,
    };

    const order = await getRazorpay().orders.create(options);

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      userId: req.user._id.toString(),
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
};

/**
 * Verify payment and create orders
 */
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orders = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product.title} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.title}. Only ${product.stock} available.`
        });
      }

      product.stock -= item.quantity;
      await product.save();

      const order = await Order.create({
        buyer: req.user._id,
        product: item.product._id,
        vendor: product.vendor,
        quantity: item.quantity,
        totalPrice: item.priceAtAddition * item.quantity,
        status: 'processing',
        paymentId: razorpay_payment_id
      });

      orders.push(order);
    }

    await cart.clearCart();

    res.status(200).json({
      message: 'Payment verified and orders created successfully',
      orders,
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Error verifying payment and creating orders' });
  }
};

/**
 * Get payment status
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await getRazorpay().payments.fetch(paymentId);

    res.status(200).json({
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      payment_method: payment.method,
      order_id: payment.order_id,
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Error retrieving payment status' });
  }
};

/**
 * Refund payment
 */
export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount, reason = 'requested_by_customer' } = req.body;

    const refund = await getRazorpay().refunds.create({
      payment_id: paymentId,
      amount: Math.round(amount * 100), // Amount in paise
      speed: 'normal',
      notes: { reason },
    });

    res.status(200).json({
      message: 'Refund initiated successfully',
      refund,
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ message: 'Error processing refund' });
  }
};