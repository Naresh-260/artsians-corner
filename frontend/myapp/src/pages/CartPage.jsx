// =================================================================
// Cart Page Component - Displays user's shopping cart
// =================================================================

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

/**
 * CartPage Component
 * 
 * Displays the user's shopping cart with items, quantities, and pricing.
 * Allows users to update quantities, remove items, and proceed to checkout.
 * 
 * @returns {JSX.Element} Cart page with cart items and checkout options
 */
function CartPage() {
  const { cart, loading, error, updateItem, removeItem, clearCartItems } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});

  // Handle quantity change
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }

    try {
      await updateItem(productId, newQuantity);
      // Update local state
      setQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
    } catch (err) {
      console.error('Failed to update item quantity:', err);
      // Revert the quantity in local state
      setQuantities(prev => ({
        ...prev,
        [productId]: prev[productId] || 1
      }));
    }
  };

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId);
      // Remove from local state
      setQuantities(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  // Handle quantity input change
  const handleInputChange = (productId, e) => {
    const newQuantity = parseInt(e.target.value) || 0;
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.priceAtAddition * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <p className="text-muted">Add some products to your cart to get started!</p>
          <a href="/" className="btn btn-primary">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2>Shopping Cart</h2>
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          {cart.items.map((item, index) => (
            <div key={item._id || index} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-3">
                  {item.product.image ? (
                    <img 
                      src={item.product.image} 
                      alt={item.product.title}
                      className="img-fluid rounded-start"
                      style={{ maxHeight: '150px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" 
                         style={{ height: '150px', borderRadius: '0.375rem 0 0 0.375rem' }}>
                      <span className="text-muted">No Image</span>
                    </div>
                  )}
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="card-title">{item.product.title}</h5>
                        <p className="card-text text-muted">{item.product.description}</p>
                        <p className="card-text">
                          <small className="text-muted">
                            Price: {formatCurrency(item.priceAtAddition)}
                          </small>
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="card-text fw-bold">
                          {formatCurrency(item.priceAtAddition * item.quantity)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <div className="d-flex align-items-center">
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control mx-2 text-center"
                          value={quantities[item.product._id] ?? item.quantity}
                          onChange={(e) => handleInputChange(item.product._id, e)}
                          onBlur={() => handleQuantityChange(item.product._id, quantities[item.product._id] ?? item.quantity)}
                          min="1"
                          style={{ width: '60px' }}
                        />
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(item.product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span className="fw-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (8%):</span>
                <span className="fw-bold">{formatCurrency(tax)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary">{formatCurrency(total)}</strong>
              </div>
              
              <button 
                className="btn btn-success w-100 mb-2"
                onClick={handleCheckout}
                disabled={!user}
              >
                Proceed to Checkout
              </button>
              
              <button 
                className="btn btn-outline-danger w-100"
                onClick={clearCartItems}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;