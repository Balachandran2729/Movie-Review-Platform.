// server/controllers/movieController.js
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/posters');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Placeholder filename; will be renamed after movie creation
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      // Pass error to handle in the route/controller
      cb(new Error('Only image files are allowed'), false); 
    }
  }
});

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
      // Assuming genre is stored as an array, find documents where the array contains the specified genre
      filter.genre = req.query.genre; 
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
    console.error("Error in getMovies:", error); // Log the error for debugging
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
      // Get reviews for this movie and populate user details
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
    console.error("Error in getMovieById:", error); // Log the error for debugging
    // Handle potential CastError from invalid ObjectId format
    if (error.name === 'CastError') {
       return res.status(400).json({ message: 'Invalid movie ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  try {
    // req.body now contains text fields, req.file contains uploaded file info (if any)
    const movieData = { ...req.body };

    // Create movie first to get the ID
    const movie = new Movie(movieData);
    const createdMovie = await movie.save();
    
    // If a file was uploaded successfully, process it
    if (req.file) {
      const oldPath = req.file.path;
      // Construct new filename using the movie's ID and original file extension
      const fileExtension = path.extname(req.file.originalname);
      const newFilename = `${createdMovie._id}${fileExtension}`;
      const newPath = path.join(path.dirname(oldPath), newFilename);
      
      // Rename the temporary file to use the movie ID
      fs.renameSync(oldPath, newPath);
      
      // Update the movie document with the relative path to the poster
      // This path will be served by Express static middleware
      createdMovie.posterUrl = `/uploads/posters/${newFilename}`;
      await createdMovie.save();
    }
    
    // Return the updated movie object (with posterUrl if uploaded)
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error("Error in createMovie:", error); // Log the error for debugging
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
       return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  // Export the upload middleware so it can be used in the route
  upload 
};