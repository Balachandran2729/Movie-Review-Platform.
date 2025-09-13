import React from 'react';
import { FaStar } from 'react-icons/fa';
import RatingStars from './RatingStars';

const ReviewCard = ({ review }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {review.userId?.profilePicture ? (
            <img 
              className="h-10 w-10 rounded-full" 
              src={review.userId.profilePicture} 
              alt={review.userId.username} 
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 text-xs font-medium">
                {review.userId?.username?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">{review.userId?.username || 'Anonymous'}</h4>
            <div className="flex items-center">
              <RatingStars rating={review.rating} />
              <span className="ml-2 text-gray-500 text-xs">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-gray-700">{review.reviewText}</p>
      </div>
    </div>
  );
};

export default ReviewCard;