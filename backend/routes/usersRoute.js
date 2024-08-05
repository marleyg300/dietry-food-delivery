import express from 'express';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password, role, phone, dietary_restrictions } = req.body;

    try {
        const user = new User({
            username,
            email,
            password,
            role,
            phone,
            dietary_restrictions: Array.isArray(dietary_restrictions) ? dietary_restrictions : [dietary_restrictions],
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        console.log(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for hardcoded admin credentials
        if (email === 'admin@admin' && password === '1234') {
            const token = jwt.sign({ userId: 'admin-id' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            return res.status(200).json({
                userId: 'admin-id',
                role: 'admin',
                username: 'admin',
                phone: '1234567890',
                token,
            });
        }

        // Regular user login
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email' });
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid password' });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({
            userId: user._id,
            role: user.role,
            username: user.username,
            phone: user.phone,
            token,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Logout Route
export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

export default router;
