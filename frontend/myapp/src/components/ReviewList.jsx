// =================================================================
// Review List Component - Displays a list of product reviews
// =================================================================

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StarRating from './StarRating';
import { formatCurrency, formatDate } from '../utils/helpers';

/**
 * ReviewList Component
 * 
 * Displays a list of product reviews with user information and ratings.
 * Supports deleting own reviews and voting on reviews.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.reviews - Array of review objects
 * @param {Function} props.onDelete - Callback when a review is deleted
 * @param {Function} props.onVote - Callback when a vote is cast
 * @param {boolean} props.showActions - Whether to show action buttons
 * @returns {JSX.Element} List of reviews
 */
function ReviewList({ reviews, onDelete, onVote, showActions = true }) {
  const { user } = useContext(AuthContext);
  const [votingReviewId, setVotingReviewId] = useState(null);

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await onDelete(reviewId);
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Failed to delete review");
      }
    }
  };

  const handleVote = async (reviewId, helpful) => {
    if (!user) {
      if (window.confirm("You need to login to vote on reviews. Would you like to login now?")) {
        window.location.href = '/login';
      }
      return;
    }
    
    setVotingReviewId(reviewId);
    try {
      await onVote(reviewId, { helpful });
    } catch (error) {
      console.error("Failed to vote on review:", error);
      alert("Failed to vote on review");
    } finally {
      setVotingReviewId(null);
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-chat-dots fs-1 text-muted mb-3"></i>
        <p className="text-muted">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review._id} className="review-card border-bottom pb-4 mb-4">
          <div className="d-flex">
            {/* Reviewer Info */}
            <div className="flex-shrink-0 me-3">
              <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '50px', height: '50px' }}>
                <span className="text-white fw-bold">
                  {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            
            {/* Review Content */}
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-1">{review.user?.name || 'Anonymous'}</h6>
                  <div className="mb-2">
                    <StarRating rating={review.rating} readOnly size="md" />
                    <span className="text-muted ms-2">
                      {formatDate(review.createdAt, 'short')}
                    </span>
                  </div>
                  {review.verifiedPurchase && (
                    <span className="badge bg-success mb-2">
                      <i className="bi bi-patch-check me-1"></i>
                      Verified Purchase
                    </span>
                  )}
                </div>
                
                {showActions && user && review.user && review.user._id === user._id && (
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(review._id)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </button>
                )}
              </div>
              
              <h6 className="fw-bold mb-2">{review.title}</h6>
              <p className="mb-3">{review.comment}</p>
              
              {showActions && ( // Show voting to all users, but handle auth in the handler
                <div className="d-flex align-items-center gap-3">
                  <small className="text-muted">Was this review helpful?</small>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleVote(review._id, true)}
                    disabled={votingReviewId === review._id}
                  >
                    {votingReviewId === review._id ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <>
                        <i className="bi bi-hand-thumbs-up me-1"></i>
                        Yes ({review.helpfulVotes || 0})
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleVote(review._id, false)}
                    disabled={votingReviewId === review._id}
                  >
                    {votingReviewId === review._id ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <>
                        <i className="bi bi-hand-thumbs-down me-1"></i>
                        No
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;