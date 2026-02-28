// =================================================================
// Cart Icon Component - Displays cart icon with item count
// =================================================================

import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * CartIcon Component
 * 
 * Displays a shopping cart icon with item count in the navigation bar.
 * Only visible when user is logged in and has items in cart.
 * 
 * @returns {JSX.Element} Cart icon with item count
 */
function CartIcon() {
  const { summary, fetchCartSummary } = useCart();
  
  // Fetch cart summary when component mounts
  useEffect(() => {
    fetchCartSummary();
  }, [fetchCartSummary]);
  
  return (
    <Link to="/cart" className="position-relative text-white text-decoration-none mx-2">
      <i className="bi bi-cart3 fs-5"></i>
      {summary.totalItems > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{
            fontSize: '0.7rem',
            padding: '0.25rem 0.5rem',
            lineHeight: '1'
          }}
        >
          {summary.totalItems}
        </span>
      )}
    </Link>
  );
}

export default CartIcon;