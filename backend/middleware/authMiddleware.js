const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // HARDCODED SECRET matching controller
            const secret = 'CYBERNOVA_SECRET_KEY_12345';
            const decoded = jwt.verify(token, secret);

            if (decoded.id === '000000000000000000000000') {
                req.user = {
                    _id: '000000000000000000000000',
                    username: 'CYBERNOVA', // Hardcoded username
                    isAdmin: true
                };
            } else {
                req.user = await Admin.findById(decoded.id).select('-password');
            }

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
