const express = require('express');
const router = express.Router();
const {
  getActiveReview,
  getAllReviews,
} = require('../controllers/reviewController');

// Public endpoints for website live countdown page
router.get('/active', getActiveReview);
router.get('/', getAllReviews);

module.exports = router;
