require('dotenv').config();
const Groq = require('groq-sdk/index.mjs');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// --- In-memory "database" for quiz attempts ---
// This array will store all attempts from all users.
// In a real application, this would be a MongoDB collection.
let quizAttempts = [];

/**
 * @desc    Generate a new quiz using the Groq API
 * @route   POST /api/quiz/generate
 * @access  Public
 */
const generateQuiz = async (req, res) => {
    const { topic, numQuestions, difficulty } = req.body;

    if (!topic || !numQuestions || !difficulty) {
        return res.status(400).json({ error: 'Topic, number of questions, and difficulty are required.' });
    }

    const systemPrompt = `You are an expert quiz-maker AI. Your task is to generate a multiple-choice quiz. Please adhere to the following rules:
    1.  Generate a quiz based on the user's specified topic, number of questions, and difficulty.
    2.  Respond ONLY with a valid JSON object. Do not include any introductory text, closing remarks, or any text outside of the JSON structure.
    3.  The root of the JSON object must be a key named "questions", which is an array of question objects.
    4.  Each question object in the array must have the following exact keys: "questionText", "options", "correctAnswerIndex", "explanation".
    5.  "questionText" should be the quiz question as a string.
    6.  "options" must be an array of exactly 4 strings representing the possible answers.
    7.  "correctAnswerIndex" must be the 0-based index of the correct answer within the "options" array.
    8.  "explanation" must be a concise and clear explanation for why the correct answer is right.`;
    
    const userPrompt = `Generate a ${numQuestions}-question quiz about "${topic}" at a ${difficulty} level.`;

    try {
        console.log('Requesting quiz from Groq API...');

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.6,
            response_format: { type: "json_object" },
        });

        const quizDataString = chatCompletion.choices[0].message.content;
        const quizData = JSON.parse(quizDataString);
        
        console.log('Successfully generated quiz from Groq.');
        console.log(quizData);
        res.json(quizData);

    } catch (error) {
        console.error("Error generating quiz with Groq:", error);
        res.status(500).json({ error: 'Failed to generate quiz from AI service.' });
    }
};

/**
 * @desc    Submit a user's quiz attempt
 * @route   POST /api/quiz/submit
 * @access  Private (requires authentication token)
 */
const submitQuiz = async (req, res) => {
    // We have req.user from our 'protect' middleware
    const userId = req.user.id;
    const { topic, score, totalQuestions } = req.body;

    if (topic === undefined || score === undefined || totalQuestions === undefined) {
        return res.status(400).json({ error: 'Missing required fields for submission.' });
    }

    const newAttempt = {
        userId, // Associate the attempt with the logged-in user
        topic,
        score: Math.round((score / totalQuestions) * 100), // Store score as percentage
        totalQuestions,
        completedAt: new Date(),
    };

    quizAttempts.push(newAttempt);
    console.log(`Quiz attempt saved for user ${userId}:`, newAttempt);
    res.status(201).json({ message: 'Quiz attempt saved successfully!' });
};


/**
 * @desc    Get the quiz history for the logged-in user
 * @route   GET /api/quiz/history
 * @access  Private (requires authentication token)
 */
const getHistory = async (req, res) => {
    // Filter the global attempts array to find only those matching the logged-in user's ID
    const userAttempts = quizAttempts.filter(attempt => attempt.userId === req.user.id);

    console.log(`Fetching history for user ${req.user.id}. Found ${userAttempts.length} attempts.`);
    
    // Return the user-specific attempts, with the most recent first
    res.status(200).json({ attempts: userAttempts.reverse() });
};


module.exports = { 
    generateQuiz,
    submitQuiz,
    getHistory
};