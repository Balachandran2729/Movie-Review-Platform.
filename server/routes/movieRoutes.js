// server/routes/movieRoutes.js
const express = require('express');
// Import the upload middleware from the controller
const { getMovies, getMovieById, createMovie, upload } = require('../controllers/movieController'); 
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply the upload middleware specifically to the POST route for creating a movie
// upload.single('poster') expects the file input field name to be 'poster'
router.route('/')
  .get(getMovies)
  .post(protect, admin, upload.single('poster'), createMovie); // <-- Added upload.single('poster')

router.route('/:id').get(getMovieById);

module.exports = router;