import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../redux/movieSlice';
import { FaStar } from 'react-icons/fa';

const SubmitReview = () => {
  const { id: movieId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector(state => state.movies);
  const { movie } = useSelector(state => state.movies);
  
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }
    
    if (!reviewText.trim()) {
      setSubmitError('Please write a review');
      return;
    }
    
    try {
      await dispatch(createReview({ movieId, reviewData: { rating, reviewText } })).unwrap();
      navigate(`/movie/${movieId}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit review');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Write a Review</h1>
        {movie && (
          <p className="text-gray-600 mb-6">For: {movie.title}</p>
        )}
        
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}
        
        {submitError && (
          <div className="mb-4 text-red-600">{submitError}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl focus:outline-none"
                >
                  <FaStar 
                    className={star <= rating ? 'text-yellow-400' : 'text-gray-300'} 
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-gray-600">{rating} Star{rating !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="reviewText"
              rows={6}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
              placeholder="Share your detailed thoughts about this movie..."
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Link 
              to={`/movie/${movieId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReview;