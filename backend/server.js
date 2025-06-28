const express = require('express');
const cors = require('cors');

// Import all route handlers
const quizRoutes = require('./routes/quizRoutes');
const tutorRoutes = require('./routes/authRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 8000;

// --- Core Middleware ---

// Enable Cross-Origin Resource Sharing (CORS) to allow requests
// from your frontend (running on a different port)
app.use(cors());

// Enable the express.json() middleware to parse incoming JSON payloads
// This is necessary to read data from request bodies (e.g., req.body)
app.use(express.json());


// --- API Routes ---

// All routes related to authentication (register, login) will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// All routes related to quizzes (generate, submit, history) will be prefixed with /api/quiz
app.use('/api/quiz', quizRoutes);

// All routes related to the AI tutor (explain) will be prefixed with /api/tutor
app.use('/api/tutor', tutorRoutes);


// --- Server Activation ---

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`🚀 Backend server is up and running on http://localhost:${PORT}`);
});