import { useState, useEffect, useContext, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createPaymentOrder, verifyPaymentAndCreateOrder } from '../services/paymentService';
import { formatCurrency } from '../utils/helpers';

// ─── Razorpay script loader (runs once, cached) ───────────────────────────────
let razorpayScriptPromise = null;
const loadRazorpayScript = () => {
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.head.appendChild(script);
  });
  return razorpayScriptPromise;
};

// ─── CheckoutPage ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { cart, clearCartItems } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect guards — rendered conditionally, no useEffect needed
  // ❌ Current - calling navigate() during render:
if (!user) {
  navigate('/login');
  return null;
}

// ✅ Fix - wrap in useEffect:
useEffect(() => {
  if (!user) navigate('/login');
}, [user, navigate]);

useEffect(() => {
  if (cart && cart.items?.length === 0) navigate('/cart');
}, [cart, navigate]);
  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.priceAtAddition * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // ── Payment handler ───────────────────────────────────────────────────────
  const handlePayment = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Create order on backend
      const { data } = await createPaymentOrder();
      const { orderId, amount, currency } = data;

      if (!orderId || !amount) {
        throw new Error('Invalid response from server — missing orderId or amount');
      }

      // 2. Ensure Razorpay SDK is loaded
      await loadRazorpayScript();

      // 3. Open Razorpay checkout
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // never hardcode fallback keys
          amount,
          currency,
          name: "Artisan's Corner",
          description: 'Order payment',
          order_id: orderId,
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: { color: '#3b82f6' },

          handler: async (response) => {
            try {
              await verifyPaymentAndCreateOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              await clearCartItems();
              resolve();
              navigate('/my-orders', {
                state: { paymentId: response.razorpay_payment_id, success: true },
              });
            } catch (verifyErr) {
              reject(verifyErr);
            }
          },

          modal: {
            ondismiss: () => {
              // User closed the modal — not an error, just stop loading
              setLoading(false);
            },
          },
        });

        rzp.on('payment.failed', (response) => {
          reject(new Error(response.error?.description || 'Payment failed'));
        });

        rzp.open();
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, navigate, clearCartItems]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container mt-5">
      <div className="row">

        {/* ── Left column ── */}
        <div className="col-md-8">
          <h2>Checkout</h2>
          <p className="text-muted">Complete your purchase</p>

          {/* Billing info */}
          <div className="mb-4">
            <h5>Billing Information</h5>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          {/* Order summary */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong className="text-primary">{formatCurrency(total)}</strong>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Pay button */}
          <div className="d-grid">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Processing…
                </>
              ) : (
                `Pay ${formatCurrency(total)} via Razorpay`
              )}
            </button>
          </div>
        </div>

        {/* ── Right column — cart items ── */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Items ({cart.items.length})</h5>
            </div>
            <div className="card-body">
              {cart.items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                >
                  <div>
                    <div className="fw-bold">{item.product.title}</div>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <div className="fw-bold">
                    {formatCurrency(item.priceAtAddition * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}