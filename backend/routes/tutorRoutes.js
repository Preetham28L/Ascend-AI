// backend/routes/tutorRoutes.js
const express = require('express');
// Make sure to import handleChat, not explainConcept
const { handleChat } = require('../controllers/tutorController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware
const router = express.Router();

/**
 * @desc    Handle a conversational chat message with the AI Tutor
 * @route   POST /api/tutor/chat
 * @access  Private (A personalized tutor needs to know the user)
 */
router.post('/chat', protect, handleChat);

module.exports = router;