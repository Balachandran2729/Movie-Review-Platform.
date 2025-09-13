import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, fetchReviewsByMovie, createReview } from '../redux/movieSlice';
import { addToWatchlist, removeFromWatchlist } from '../redux/userSlice';
import { FaStar, FaHeart, FaRegHeart, FaPencilAlt } from 'react-icons/fa';
import ReviewCard from '../components/ReviewCard';
import RatingStars from '../components/RatingStars';

// Define the backend URL base
const BACKEND_URL = 'http://localhost:5000'; // Adjust if your backend runs on a different host/port

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { movie, reviews, loading, error } = useSelector(state => state.movies);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { watchlist } = useSelector(state => state.user);
  
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    dispatch(fetchMovieById(id));
    dispatch(fetchReviewsByMovie(id));
  }, [dispatch, id]);

  // Check if the movie is in the user's watchlist
  const isInWatchlist = watchlist.some(item => item.movieId?._id === id || item.movieId === id);

  const handleAddToWatchlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToWatchlist({ userId: user._id, movieId: id }));
  };

  const handleRemoveFromWatchlist = () => {
    dispatch(removeFromWatchlist({ userId: user._id, movieId: id }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (userRating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    
    if (!reviewText.trim()) {
      setReviewError('Please write a review');
      return;
    }
    
    setSubmitting(true);
    setReviewError('');
    
    try {
      await dispatch(createReview({ movieId: id, reviewData: { rating: userRating, reviewText } })).unwrap();
      setUserRating(0);
      setReviewText('');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Function to construct the full image URL
  const getFullImageUrl = (posterPath) => {
    if (!posterPath) return null;
    // If it's already a full URL, return it. Otherwise, prepend the backend URL.
    if (posterPath.startsWith('http')) {
      return posterPath;
    }
    return `${BACKEND_URL}${posterPath}`;
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading movie details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="container mx-auto p-4">Movie not found</div>;
  }

  // Get the full URL for the poster image
  const fullPosterUrl = getFullImageUrl(movie.posterUrl);

  return (
    <div className="container mx-auto p-4">
      {/* Movie Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          {/* Poster Image Section */}
          <div className="md:flex-shrink-0 md:w-1/3">
            {fullPosterUrl ? (
              <img 
                src={fullPosterUrl}
                alt={movie.title}
                className="h-96 w-full object-cover md:h-full md:w-full"
                onError={(e) => {
                  // Fallback if the image fails to load
                  e.target.onerror = null;
                  e.target.closest('div').innerHTML = '<div class="bg-gray-200 h-96 md:h-full flex items-center justify-center"><span class="text-gray-500">Image Error</span></div>';
                }}
              />
            ) : (
              <div className="bg-gray-200 h-96 md:h-full flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          
          {/* Movie Details Section */}
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>
                <div className="mt-2 flex items-center">
                  <span className="text-gray-600 mr-4">{movie.releaseYear}</span>
                  <RatingStars rating={movie.averageRating} />
                  <span className="ml-2 text-gray-600">({movie.totalReviews || 0} reviews)</span>
                </div>
              </div>
              
              {/* Watchlist Button */}
              <button
                onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
                className="ml-4 p-2 rounded-full hover:bg-gray-100"
                aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {isInWatchlist ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-500 text-xl" />
                )}
              </button>
            </div>
            
            {/* Director and Genre */}
            <div className="mt-4">
              <p className="text-gray-600">
                <span className="font-semibold">Director:</span> {movie.director}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-semibold">Genre:</span> {movie.genre?.join(', ')}
              </p>
            </div>
            
            {/* Synopsis */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Synopsis</h2>
              <p className="mt-2 text-gray-600">{movie.synopsis}</p>
            </div>
            
            {/* Cast */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Cast</h2>
              <p className="mt-2 text-gray-600">{movie.cast?.join(', ') || 'N/A'}</p>
            </div>
            
            {/* Trailer Link */}
            {movie.trailerUrl && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900">Trailer</h2>
                <a 
                  href={movie.trailerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                >
                  Watch Trailer
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {isAuthenticated && (
            <Link 
              to={`/movie/${id}/review`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPencilAlt className="mr-2" /> Write Review
            </Link>
          )}
        </div>
        
        {/* Inline Review Form (Visible only if authenticated) */}
        {isAuthenticated && (
          <div className="border-t border-gray-200 pt-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              {/* Rating Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="text-2xl focus:outline-none"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <FaStar 
                        className={star <= userRating ? 'text-yellow-400' : 'text-gray-300'} 
                      />
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="ml-2 text-gray-600">{userRating} Star{userRating !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
              
              {/* Review Textarea */}
              <div className="mb-4">
                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="reviewText"
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                  placeholder="Share your thoughts about this movie..."
                />
              </div>
              
              {/* Error Message */}
              {reviewError && (
                <div className="mb-4 text-red-600 text-sm">{reviewError}</div>
              )}
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
        
        {/* Reviews List */}
        <div>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;