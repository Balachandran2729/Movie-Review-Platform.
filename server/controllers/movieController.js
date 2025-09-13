const Movie = require('../models/Movie');
const Review = require('../models/Review');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    // Build filter object
    const filter = {};
    
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }
    
    if (req.query.genre) {
      filter.genre = { $in: [req.query.genre] };
    }
    
    if (req.query.year) {
      filter.releaseYear = Number(req.query.year);
    }
    
    if (req.query.minRating) {
      filter.averageRating = { $gte: Number(req.query.minRating) };
    }

    const count = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      movies,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (movie) {
      // Get reviews for this movie
      const reviews = await Review.find({ movieId: movie._id })
        .populate('userId', 'username profilePicture');
      
      res.json({
        ...movie._doc,
        reviews
      });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie
};