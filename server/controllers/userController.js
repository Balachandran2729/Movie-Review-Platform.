const User = require('../models/User');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      // Get user's reviews
      const reviews = await Review.find({ userId: user._id })
        .populate('movieId', 'title posterUrl');
      
      res.json({
        ...user._doc,
        reviews
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's watchlist
// @route   GET /api/users/:id/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.params.id })
      .populate('movieId');
    
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/users/:id/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.params.id;

    // Check if already in watchlist
    const existing = await Watchlist.findOne({ userId, movieId });
    if (existing) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    const watchlistItem = new Watchlist({
      userId,
      movieId
    });

    const createdItem = await watchlistItem.save();
    await createdItem.populate('movieId');
    
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/users/:id/watchlist/:movieId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const removed = await Watchlist.findOneAndDelete({
      userId: req.params.id,
      movieId: req.params.movieId
    });

    if (removed) {
      res.json({ message: 'Removed from watchlist' });
    } else {
      res.status(404).json({ message: 'Item not found in watchlist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};