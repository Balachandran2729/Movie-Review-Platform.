import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchWatchlist } from '../redux/userSlice';
import { FaUser, FaFilm, FaStar, FaHeart } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import ReviewCard from '../components/ReviewCard';
import RatingStars from '../components/RatingStars';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, watchlist, loading } = useSelector(state => state.user);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserProfile(user._id));
      dispatch(fetchWatchlist(user._id));
    }
  }, [dispatch, user?._id]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto p-4">Profile not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {profile.profilePicture ? (
                <img 
                  className="h-24 w-24 rounded-full" 
                  src={profile.profilePicture} 
                  alt={profile.username} 
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="text-gray-500 text-3xl" />
                </div>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-500 text-sm mt-1">
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <FaHeart className="text-red-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">My Watchlist</h2>
          <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {watchlist.length}
          </span>
        </div>
        
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map(item => (
              <MovieCard key={item.movieId._id || item.movieId} movie={item.movieId} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Your watchlist is empty.</p>
        )}
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <FaStar className="text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">My Reviews</h2>
          <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {profile.reviews?.length || 0}
          </span>
        </div>
        
        {profile.reviews && profile.reviews.length > 0 ? (
          <div className="space-y-6">
            {profile.reviews.map(review => (
              <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{review.movieId?.title || 'Movie Title'}</h3>
                    <div className="flex items-center mt-1">
                      <RatingStars rating={review.rating} />
                      <span className="ml-2 text-gray-600 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">{review.reviewText}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">You haven't written any reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;