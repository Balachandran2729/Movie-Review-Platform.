import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createMovie } from '../redux/movieSlice';
import { FaFilm, FaCalendarAlt, FaUser, FaList, FaAlignLeft, FaLink, FaImage } from 'react-icons/fa';

const CreateMovie = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.movies);

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    director: '',
    cast: '',
    synopsis: '',
    poster: null,
    trailerUrl: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    title,
    genre,
    releaseYear,
    director,
    cast,
    synopsis,
    poster,
    trailerUrl
  } = formData;

  const onChange = (e) => {
    if (e.target.name === 'poster') {
      const file = e.target.files[0];
      setFormData({ ...formData, poster: file });
      
      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object for file upload
    const movieData = new FormData();
    movieData.append('title', title);
    movieData.append('genre', genre);
    movieData.append('releaseYear', releaseYear);
    movieData.append('director', director);
    movieData.append('cast', cast);
    movieData.append('synopsis', synopsis);
    movieData.append('trailerUrl', trailerUrl);
    
    if (poster) {
      movieData.append('poster', poster);
    }

    try {
      await dispatch(createMovie(movieData)).unwrap();
      navigate('/movies');
    } catch (err) {
      console.error('Failed to create movie:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Movie</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              <FaFilm className="inline mr-2" /> Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter movie title"
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              <FaList className="inline mr-2" /> Genres
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={genre}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Comma separated (e.g., Action, Sci-Fi)"
            />
            <p className="mt-1 text-xs text-gray-500">Enter genres separated by commas</p>
          </div>

          {/* Release Year */}
          <div>
            <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700 mb-1">
              <FaCalendarAlt className="inline mr-2" /> Release Year
            </label>
            <input
              type="number"
              id="releaseYear"
              name="releaseYear"
              value={releaseYear}
              onChange={onChange}
              required
              min="1888"
              max={new Date().getFullYear() + 5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2023"
            />
          </div>

          {/* Director */}
          <div>
            <label htmlFor="director" className="block text-sm font-medium text-gray-700 mb-1">
              <FaUser className="inline mr-2" /> Director
            </label>
            <input
              type="text"
              id="director"
              name="director"
              value={director}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter director name"
            />
          </div>

          {/* Cast */}
          <div>
            <label htmlFor="cast" className="block text-sm font-medium text-gray-700 mb-1">
              <FaUser className="inline mr-2" /> Cast
            </label>
            <input
              type="text"
              id="cast"
              name="cast"
              value={cast}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Comma separated (e.g., Actor 1, Actor 2)"
            />
            <p className="mt-1 text-xs text-gray-500">Enter cast members separated by commas</p>
          </div>

          {/* Synopsis */}
          <div>
            <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 mb-1">
              <FaAlignLeft className="inline mr-2" /> Synopsis
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              value={synopsis}
              onChange={onChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter movie synopsis"
            ></textarea>
          </div>

          {/* Poster Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaImage className="inline mr-2" /> Poster Image
            </label>
            <input
              type="file"
              id="poster"
              name="poster"
              onChange={onChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {previewUrl && (
              <div className="mt-2">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="h-32 w-auto object-cover rounded"
                />
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">Upload a poster image for the movie</p>
          </div>

          {/* Trailer URL */}
          <div>
            <label htmlFor="trailerUrl" className="block text-sm font-medium text-gray-700 mb-1">
              <FaLink className="inline mr-2" /> Trailer URL
            </label>
            <input
              type="url"
              id="trailerUrl"
              name="trailerUrl"
              value={trailerUrl}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/trailer"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/movies')}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMovie;