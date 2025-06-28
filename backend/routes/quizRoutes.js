// backend/routes/quizRoutes.js
const express = require('express');
const { generateQuiz, submitQuiz, getHistory } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware'); // <-- IMPORT
const router = express.Router();

// Public route
router.post('/generate', generateQuiz);

// Protected routes
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getHistory);

module.exports = router;