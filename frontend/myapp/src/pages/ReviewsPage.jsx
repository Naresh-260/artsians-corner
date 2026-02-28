// =================================================================
// Reviews Page - Displays all reviews with filtering and sorting
// =================================================================

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserReviews, voteOnReview } from '../services/reviewService';
import { AuthContext } from '../context/AuthContext';
import ReviewList from '../components/ReviewList';
import StarRating from '../components/StarRating';

/**
 * ReviewsPage Component
 * 
 * Displays a user's reviews with filtering and sorting options.
 * Allows users to manage their reviews.
 * 
 * @returns {JSX.Element} Reviews page component
 */
function ReviewsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('-createdAt');
  const [filterOption, setFilterOption] = useState('all');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch user reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getUserReviews({
          sortBy: sortOption
        });
        
        let filteredReviews = response.data.reviews;
        
        // Apply filter
        if (filterOption !== 'all') {
          filteredReviews = filteredReviews.filter(review => 
            review.rating === parseInt(filterOption)
          );
        }
        
        setReviews(filteredReviews);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchReviews();
    }
  }, [user, sortOption, filterOption]);

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      // Remove from local state
      setReviews(prev => prev.filter(review => review._id !== reviewId));
      alert('Review deleted successfully!');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete review');
    }
  };

  // Handle voting on a review
  const handleVoteOnReview = async (reviewId, voteData) => {
    try {
      await voteOnReview(reviewId, voteData);
      // Optionally update local state if needed
      console.log(`Successfully voted on review ${reviewId}:`, voteData);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to vote on review');
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Reviews</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="-rating">Highest Rated</option>
            <option value="rating">Lowest Rated</option>
          </select>
          
          <select 
            className="form-select"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-chat-dots fs-1 text-muted"></i>
          </div>
          <h4>No Reviews Yet</h4>
          <p className="text-muted">
            You haven't written any reviews yet. 
            Start by reviewing products you've purchased.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-muted">
              Showing {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <ReviewList 
            reviews={reviews}
            onDelete={handleDeleteReview}
            onVote={handleVoteOnReview}
            showActions={true}
          />
        </>
      )}
    </div>
  );
}

export default ReviewsPage;