import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        ) : (
          <div className="placeholder-image">
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description?.substring(0, 100)}...</p>
        <div className="product-price">{formatPrice(product.price)}</div>
        <div className="product-actions">
          <button 
            className="btn btn-primary"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;