// =================================================================
// Review Form Component - UI for creating/editing reviews
// =================================================================

import { useState } from 'react';
import StarRating from './StarRating';

/**
 * ReviewForm Component
 * 
 * Provides a form for users to submit product reviews with ratings.
 * Includes fields for title, comment, and star rating.
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {Object} props.review - Existing review data (for editing)
 * @param {boolean} props.loading - Whether the form is in loading state
 * @param {string} props.buttonText - Text for submit button
 * @returns {JSX.Element} Review form component
 */
function ReviewForm({ onSubmit, review = null, loading = false, buttonText = "Submit Review" }) {
  const [formData, setFormData] = useState({
    rating: review?.rating || 0,
    title: review?.title || '',
    comment: review?.comment || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.rating <= 0) {
      newErrors.rating = 'Rating is required';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Rating *</label>
        <div>
          <StarRating 
            rating={formData.rating} 
            onChange={(rating) => handleChange('rating', rating)} 
            size="lg"
          />
        </div>
        {errors.rating && <div className="text-danger">{errors.rating}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="reviewTitle" className="form-label">Review Title *</label>
        <input
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          id="reviewTitle"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Give your review a title"
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="reviewComment" className="form-label">Review Comment *</label>
        <textarea
          className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
          id="reviewComment"
          rows="4"
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          placeholder="Share your experience with this product..."
        ></textarea>
        {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            {buttonText}...
          </>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}

export default ReviewForm;