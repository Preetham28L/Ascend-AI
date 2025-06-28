// backend/models/QuizAttempt.js
const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For when you add users
  topic: { type: String, required: true },
  score: { type: Number, required: true }, // Score as a percentage, e.g., 80
  totalQuestions: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);