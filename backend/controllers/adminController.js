const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            username: admin.username,
            token: generateToken(admin._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

// @desc    Register a new admin (Seeding purpose)
// @route   POST /api/admin/register
// @access  Public (Should be protected or removed in prod)
const registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
        username,
        password
    });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            username: admin.username,
            token: generateToken(admin._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

module.exports = { authAdmin, registerAdmin };
