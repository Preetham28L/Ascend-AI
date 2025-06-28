const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

// We export a placeholder if mongoose is not connected
module.exports = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);