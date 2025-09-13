import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/movieSlice';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, loading, error, totalPages, currentPage } = useSelector(state => state.movies);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // Debounce searchTerm
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  useEffect(() => {
    const params = {
      page,
      search: debouncedSearchTerm || undefined,
    };
    dispatch(fetchMovies(params));
  }, [dispatch, page, debouncedSearchTerm]); // Use debounced term

  const handleSearch = (e) => {
    e.preventDefault();
    // setPage(1) is now handled by the useEffect when searchTerm changes and gets debounced
    // setPage(1); 
  };

  const handleReset = () => {
    setSearchTerm('');
    setPage(1);
  };

  if (loading && currentPage === 1) {
    return <div className="container mx-auto p-4">Loading movies...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Browse Movies</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              {/* Input now uses searchTerm directly and updates it on change */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Reset to page 1 when user starts typing a new search
                  if (page !== 1) setPage(1);
                }}
                placeholder="Search movies by name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="md:col-span-1 flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-100 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaFilter className="mr-2" /> Reset
            </button>
          </div>
        </form>
        
        <div className="flex justify-between items-center mt-4">
          <div></div>
          <div className="text-sm text-gray-500">
            Showing {movies.length} of many movies
          </div>
        </div>
      </div>
      
      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-8">Loading more movies...</div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                Page {page} of {totalPages || 1}
              </span>
              
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= totalPages}
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No movies found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default Movies;