const Review = require('../models/Review');
const Movie = require('../models/Movie');

// @desc    Get reviews for a movie
// @route   GET /api/movies/:id/reviews
// @access  Public
const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id })
      .populate('userId', 'username profilePicture');
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/movies/:id/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const movieId = req.params.id;
    const userId = req.user._id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ userId, movieId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    // Create review
    const review = new Review({
      userId,
      movieId,
      rating,
      reviewText
    });

    const createdReview = await review.save();

    // Update movie's average rating
    const reviews = await Review.find({ movieId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    movie.averageRating = parseFloat(averageRating.toFixed(1));
    movie.totalReviews = reviews.length;
    await movie.save();

    // Populate user info before sending response
    await createdReview.populate('userId', 'username profilePicture');
    
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviewsByMovie,
  createReview
};