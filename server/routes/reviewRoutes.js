const express = require('express');
const { getReviewsByMovie, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/').get(getReviewsByMovie).post(protect, createReview);

module.exports = router;