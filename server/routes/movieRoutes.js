const express = require('express');
const { getMovies, getMovieById, createMovie } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getMovies).post(protect, admin, createMovie);
router.route('/:id').get(getMovieById);

module.exports = router;