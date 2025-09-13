import React from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5000'; // Adjust if your backend URL is different

const MovieCard = ({ movie }) => {
  // Construct the full image URL if posterUrl is a relative path starting with /uploads
  const fullImageUrl = movie.posterUrl 
    ? movie.posterUrl.startsWith('/uploads') 
      ? `${BACKEND_URL}${movie.posterUrl}` 
      : movie.posterUrl // If it's already a full URL, use it as is
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {fullImageUrl ? (
        <img 
          src={fullImageUrl} 
          alt={movie.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback if the image fails to load
            e.target.onerror = null; 
            e.target.parentElement.innerHTML = '<div class="bg-gray-200 h-48 flex items-center justify-center"><span class="text-gray-500">Image Error</span></div>';
          }}
        />
      ) : (
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">{movie.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{movie.releaseYear}</p>
        <div className="flex justify-between items-center">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {movie.averageRating?.toFixed(1) || 'N/A'} ⭐
          </span>
          <Link 
            to={`/movie/${movie._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;