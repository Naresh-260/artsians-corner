// =================================================================
// All Reviews Page - Displays all reviews for a product with filtering
// =================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductReviews, getProductRating, voteOnReview } from '../services/reviewService';
import StarRating from '../components/StarRating';
import ReviewList from '../components/ReviewList';

/**
 * AllReviewsPage Component
 * 
 * Displays all reviews for a specific product with filtering and sorting options.
 * Similar to Amazon/Flipkart review pages.
 * 
 * @returns {JSX.Element} All reviews page component
 */
function AllReviewsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('-createdAt');
  const [filterRating, setFilterRating] = useState('all');
  const [productName, setProductName] = useState('');

  // Fetch all reviews and product info
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch reviews
        const reviewsResponse = await getProductReviews(productId, {
          sortBy: sortOption
        });
        
        // Fetch rating
        const ratingResponse = await getProductRating(productId);
        
        setReviews(reviewsResponse.data.reviews);
        setRating(ratingResponse.data);
        setProductName(reviewsResponse.data.reviews[0]?.product?.title || 'Product');
        
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchData();
    }
  }, [productId, sortOption]);

  // Filter reviews by rating
  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filterRating));

  // Calculate rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const handleVoteOnReview = async (reviewId, voteData) => {
    try {
      await voteOnReview(reviewId, voteData);
      // Optionally update local state if needed
      console.log(`Successfully voted on review ${reviewId}:`, voteData);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to vote on review');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-link p-0 ms-2"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button 
            className="btn btn-link p-0 mb-2"
            onClick={() => navigate(-1)}
          >
            ← Back to Product
          </button>
          <h2>{productName}</h2>
        </div>
        <div className="text-end">
          <div className="d-flex align-items-center">
            <StarRating rating={rating.averageRating} readOnly size="lg" />
            <span className="ms-2 fs-4">
              {rating.averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-muted mb-0">
            {rating.reviewCount} review{rating.reviewCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="row">
        {/* Sidebar - Rating Filter */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Filter by Rating</h5>
              
              <div className="mb-3">
                <button 
                  className={`btn btn-outline-primary w-100 text-start ${filterRating === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterRating('all')}
                >
                  All Reviews ({reviews.length})
                </button>
              </div>
              
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="mb-2">
                  <button 
                    className={`btn btn-outline-secondary w-100 text-start d-flex align-items-center ${filterRating === star.toString() ? 'active' : ''}`}
                    onClick={() => setFilterRating(star.toString())}
                  >
                    <StarRating rating={star} readOnly size="sm" />
                    <span className="ms-2">
                      {star} star{star !== 1 ? 's' : ''} ({ratingDistribution[star]})
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Reviews */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>
              {filterRating === 'all' 
                ? `${filteredReviews.length} reviews` 
                : `${filteredReviews.length} ${filterRating}-star reviews`
              }
            </h4>
            
            <select 
              className="form-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="-createdAt">Most Recent</option>
              <option value="createdAt">Oldest</option>
              <option value="-rating">Highest Rated</option>
              <option value="rating">Lowest Rated</option>
              <option value="-helpfulVotes">Most Helpful</option>
            </select>
          </div>

          {filteredReviews.length > 0 ? (
            <ReviewList 
              reviews={filteredReviews}
              onDelete={() => {}} // No delete functionality on public page
              onVote={handleVoteOnReview}
              showActions={true}
            />
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-chat-dots fs-1 text-muted mb-3"></i>
              <h5 className="text-muted">
                {filterRating === 'all' 
                  ? 'No reviews yet' 
                  : `No ${filterRating}-star reviews`
                }
              </h5>
              <p className="text-muted">
                Be the first to share your experience.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllReviewsPage;