// =================================================================
// Star Rating Component - Interactive star rating UI
// =================================================================

import { useState } from 'react';

/**
 * StarRating Component
 * 
 * Displays an interactive star rating component that allows users to select a rating.
 * Can be used in both interactive and read-only modes.
 * 
 * @param {Object} props - Component properties
 * @param {number} props.rating - Current rating value (0-5)
 * @param {boolean} props.readOnly - Whether the rating is read-only
 * @param {Function} props.onChange - Callback when rating changes (for interactive mode)
 * @param {string} props.size - Size of the stars ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Star rating component
 */
function StarRating({ rating = 0, readOnly = false, onChange, size = 'md', className = '' }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [internalRating, setInternalRating] = useState(rating);
  
  // Update internal rating when external rating changes
  if (rating !== internalRating && !readOnly) {
    setInternalRating(rating);
  }
  
  const sizeClasses = {
    sm: 'fs-6',
    md: '',
    lg: 'fs-4'
  };
  
  const handleStarClick = (starValue) => {
    if (!readOnly && onChange) {
      onChange(starValue);
      setInternalRating(starValue);
    }
  };
  
  const handleStarHover = (starValue) => {
    if (!readOnly) {
      setHoverRating(starValue);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };
  
  const currentRating = readOnly ? rating : (hoverRating || internalRating);
  
  return (
    <div className={`star-rating ${className}`} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${sizeClasses[size]} ${readOnly ? 'read-only' : 'interactive'} ${
            star <= currentRating ? 'filled' : 'empty'
          }`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= currentRating ? '#ffc107' : '#dee2e6',
            transition: 'color 0.2s ease',
            fontSize: size === 'sm' ? '1rem' : size === 'lg' ? '1.5rem' : '1.25rem',
            marginRight: '2px'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;