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
    try {
        const { username, password } = req.body;

        const envUsername = process.env.ADMIN_USERNAME;
        const envPassword = process.env.ADMIN_PASSWORD;

        if (!envUsername || !envPassword) {
            console.error('Server Error: Admin credentials not configured.');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Safe comparison
        const isUsernameMatch = username && username.trim() === envUsername.trim();
        const isPasswordMatch = password && password.trim() === envPassword.trim();

        if (isUsernameMatch && isPasswordMatch) {
            // Use a static ID for the admin since we are not using DB
            const staticId = '000000000000000000000000';

            res.json({
                _id: staticId,
                username: envUsername,
                token: generateToken(staticId)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = { authAdmin };
