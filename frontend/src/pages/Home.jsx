import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/movieSlice';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector(state => state.movies);

  useEffect(() => {
    // Fetch featured/trending movies
    dispatch(fetchMovies({ page: 1, limit: 6 }));
  }, [dispatch]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to MovieReviews</h1>
        <p className="text-center text-gray-600 mb-12">Discover, review, and rate your favorite movies</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {movies.slice(0, 4).map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;