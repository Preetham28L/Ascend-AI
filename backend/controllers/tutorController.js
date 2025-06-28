// backend/controllers/tutorController.js
require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const handleChat = async (req, res) => {
    const { messages, weakTopics } = req.body;

    // AFTER
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Valid chat messages are required.' });
    }

    // This is the powerful new system prompt for personalization
    const systemPrompt = `You are "Mate", an expert AI tutor with a friendly and encouraging personality.
    Your primary goal is to help the student understand concepts they find difficult.

    You have been provided with a list of topics the student has struggled with in past quizzes: ${
        weakTopics && weakTopics.length > 0 ? weakTopics.join(', ') : 'None yet'
    }.

    Follow these rules strictly:
    1.  Use this list of weak topics to proactively guide the conversation. If the conversation is new, start by asking if they'd like to review one of these topics. For example: "Hey there! I noticed you had some trouble with 'Photosynthesis' and 'The Roman Empire' on your quizzes. Would you like to dive into one of those?"
    2.  If the user asks a question, answer it clearly and simply. Use analogies and real-world examples.
    3.  After explaining a concept, ask a follow-up question to check for understanding. For example: "Does that make sense? Can you try explaining it back to me in your own words?"
    4.  Keep your tone supportive and positive. Never say "you are wrong." Instead, say "That's a good try, but let's look at it from another angle."
    5.  The 'messages' array you receive contains the entire conversation history. Use it to maintain context and avoid repeating yourself.`;

    try {
        console.log('Requesting chat completion from Groq API...');
        
        const chatCompletion = await groq.chat.completions.create({
            // Prepend our powerful system prompt to the conversation history
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages 
            ],
            model: 'llama3-8b-8192',
            temperature: 0.7,
        });

        const reply = chatCompletion.choices[0].message.content;
        
        console.log('Successfully generated chat reply.');
        res.json({ reply });

    } catch (error) {
        console.error("Error generating chat reply with Groq:", error);
        res.status(500).json({ error: 'Failed to generate chat reply from AI service.' });
    }
};

module.exports = { handleChat };