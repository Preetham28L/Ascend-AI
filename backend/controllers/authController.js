// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- In-memory database ---
// In a real app, you would interact with MongoDB here.
const users = []; 
let userIdCounter = 1;

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if user already exists
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // "Save" the new user
    const newUser = { id: userIdCounter++, username, password: hashedPassword };
    users.push(newUser);
    console.log('Registered new user:', { id: newUser.id, username: newUser.username });

    res.status(201).json({ message: 'User registered successfully!' });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create JWT
    const token = jwt.sign(
        { id: user.id, username: user.username },
        'your_jwt_secret', // Use a long, random secret string from your .env file in a real app!
        { expiresIn: '1h' }
    );

    res.json({
        token,
        user: { id: user.id, username: user.username }
    });
};

module.exports = { register, login };