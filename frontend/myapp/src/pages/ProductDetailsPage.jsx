// =================================================================
// Product Details Page - Shows product details with reviews
// =================================================================

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { getProductReviews, createReview, deleteReview, voteOnReview, getProductRating } from '../services/reviewService';
import { getMyOrders } from '../services/orderService';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import { formatCurrency, formatDate } from '../utils/helpers';

function ProductDetails() {
  const { productId } = useParams();
  const { user } = useContext(AuthContext);
  const { addItem, loading: cartLoading } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [cartLoading2, setCartLoading2] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 4000);
  };

  // ── Fetch product + reviews + rating ──────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productRes, reviewsRes, ratingRes] = await Promise.all([
          getProductById(productId),
          getProductReviews(productId),
          getProductRating(productId),
        ]);

        setProduct(productRes.data);
        const fetchedReviews = reviewsRes.data.reviews || reviewsRes.data || [];
        setReviews(fetchedReviews);
        setRating(ratingRes.data);

        if (user) {
          const existing = fetchedReviews.find(
            r => r.user?._id === user._id || r.user === user._id
          );
          setUserReview(existing || null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchData();
  }, [productId, user]);

  // ── Check if buyer has purchased this product ─────────────────────
  useEffect(() => {
    if (!user || user.role !== 'buyer') return;

    const checkPurchase = async () => {
      try {
        const { data } = await getMyOrders(user.token);
        const orders = data.orders || data || [];
        const purchased = orders.some(
          o => (o.product?._id === productId || o.product === productId)
            && o.status !== 'cancelled'
        );
        setHasPurchased(purchased);
      } catch (err) {
        console.error('Could not verify purchase status:', err);
      }
    };

    checkPurchase();
  }, [user, productId]);

  // ── Add to cart ───────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'buyer') { showError('Only buyers can add items to cart'); return; }

    try {
      setCartLoading2(true);
      await addItem(productId, 1);
      showSuccess('Item added to cart!');
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setCartLoading2(false);
    }
  };

  // ── Buy now ───────────────────────────────────────────────────────
  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'buyer') { showError('Only buyers can purchase products'); return; }

    try {
      setCartLoading2(true);
      await addItem(productId, 1);
      navigate('/checkout');
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setCartLoading2(false);
    }
  };

  // ── Submit review ─────────────────────────────────────────────────
  const handleSubmitReview = async (reviewData) => {
    try {
      setReviewLoading(true);
      const response = await createReview({ productId, ...reviewData });
      const newReview = response.data;

      setReviews(prev => [newReview, ...prev]);
      setUserReview(newReview);
      setShowReviewForm(false);

      // Refresh rating
      const ratingRes = await getProductRating(productId);
      setRating(ratingRes.data);

      showSuccess('Review submitted successfully!');
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  // ── Delete review ─────────────────────────────────────────────────
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      if (userReview?._id === reviewId) setUserReview(null);

      // Refresh rating
      const ratingRes = await getProductRating(productId);
      setRating(ratingRes.data);

      showSuccess('Review deleted successfully!');
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to delete review');
      throw err; // Let ReviewList handle its own state
    }
  };

  // ── Vote on review ────────────────────────────────────────────────
  const handleVoteOnReview = async (reviewId, voteData) => {
    try {
      await voteOnReview(reviewId, voteData);
      // Refresh reviews to get updated vote counts
      const reviewsRes = await getProductReviews(productId);
      setReviews(reviewsRes.data.reviews || reviewsRes.data || []);
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to vote on review');
      throw err;
    }
  };

  // ── Loading / Error ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">Product not found.</div>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const canWriteReview = user && user.role === 'buyer' && hasPurchased && !userReview;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="container mt-5 mb-5">

      {/* Global messages */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} />
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible">
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage('')} />
        </div>
      )}

      {/* ── Product section ── */}
      <div className="row mb-5">
        <div className="col-md-6">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '500px', objectFit: 'contain', width: '100%' }}
              onError={e => { e.target.src = '/placeholder-image.jpg'; }}
            />
          ) : (
            <div
              className="bg-light d-flex align-items-center justify-content-center rounded"
              style={{ height: '400px' }}
            >
              <span className="text-muted">No Image Available</span>
            </div>
          )}
        </div>

        <div className="col-md-6">
          <button className="btn btn-link ps-0 text-muted mb-2" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h1 className="fw-bold mb-2">{product.title}</h1>

          {/* Rating */}
          <div className="d-flex align-items-center mb-3">
            <StarRating rating={rating.averageRating} readOnly size="lg" />
            <span className="ms-2 text-muted">
              {Number(rating.averageRating).toFixed(1)} ({rating.reviewCount} review{rating.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>

          <h3 className="text-primary mb-3">{formatCurrency(product.price)}</h3>

          <p className="text-muted mb-3">{product.description}</p>

          <div className="mb-3">
            {product.vendor?.name && (
              <p className="mb-1"><strong>Vendor:</strong> {product.vendor.name}</p>
            )}
            <p className="mb-1">
              <strong>Stock:</strong>{' '}
              {inStock
                ? <span className="text-success">{product.stock} in stock</span>
                : <span className="text-danger">Out of stock</span>
              }
            </p>
            {product.category && (
              <p className="mb-1"><strong>Category:</strong> {product.category}</p>
            )}
          </div>

          {/* Cart / Buy buttons */}
          <div className="d-grid gap-2">
            {inStock ? (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={cartLoading2}
                >
                  {cartLoading2 ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Adding...</>
                  ) : 'Add to Cart'}
                </button>
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleBuyNow}
                  disabled={cartLoading2}
                >
                  Buy Now
                </button>
              </>
            ) : (
              <button className="btn btn-secondary btn-lg" disabled>
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Reviews section ── */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Customer Reviews</h3>

            {canWriteReview && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowReviewForm(prev => !prev)}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review gate messages */}
          {user && user.role === 'buyer' && !hasPurchased && (
            <div className="alert alert-info">
              Purchase this product to leave a review.
            </div>
          )}

          {userReview && (
            <div className="alert alert-success">
              ✓ You have already reviewed this product.
            </div>
          )}

          {/* Review form */}
          {showReviewForm && canWriteReview && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Write Your Review</h5>
                <ReviewForm
                  onSubmit={handleSubmitReview}
                  loading={reviewLoading}
                  buttonText="Submit Review"
                />
              </div>
            </div>
          )}

          {/* Review list */}
          <ReviewList
            reviews={reviews}
            onDelete={handleDeleteReview}
            onVote={handleVoteOnReview}
            showActions={!!user}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;