import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const RatingStars = ({ rating, max = 5, size = 'sm' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);
  
  const sizeClass = size === 'lg' ? 'text-xl' : 'text-sm';
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className={`${sizeClass} text-yellow-400`} />
      ))}
      {hasHalfStar && <FaStarHalfAlt className={`${sizeClass} text-yellow-400`} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className={`${sizeClass} text-yellow-400`} />
      ))}
      <span className="ml-1 text-gray-600 text-xs">({rating?.toFixed(1)})</span>
    </div>
  );
};

export default RatingStars;