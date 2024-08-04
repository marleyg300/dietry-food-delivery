import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const verifyAdmin = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Handle hardcoded admin case
        if (decoded.userId === 'admin-id') {
            req.user = { role: 'admin' }; // Simulate an admin user
            return next();
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user; // Store user in request for further use
        next();
    } catch (error) {
        console.error('Token verification failed:', error); // Debug info
        res.status(401).json({ message: 'Unauthorized' });
    }
};
