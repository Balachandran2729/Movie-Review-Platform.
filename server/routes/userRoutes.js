const express = require('express');
const { 
  getUserProfile, 
  updateUserProfile, 
  getWatchlist, 
  addToWatchlist, 
  removeFromWatchlist 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:id').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id/watchlist').get(protect, getWatchlist).post(protect, addToWatchlist);
router.route('/:id/watchlist/:movieId').delete(protect, removeFromWatchlist);

module.exports = router;