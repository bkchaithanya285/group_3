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

        const envUsername = process.env.ADMIN_USERNAME || '';
        const envPassword = process.env.ADMIN_PASSWORD || '';

        console.log('--- Admin Login Attempt ---');
        console.log('Received Username:', username);
        // Do NOT log the actual password in production logs, only length check
        console.log('Received Password Length:', password ? password.length : 0);
        console.log('Env Username:', envUsername);
        console.log('Env Password Length:', envPassword ? envPassword.length : 0);

        if (!envUsername || !envPassword) {
            console.error('CRITICAL: ADMIN_USERNAME or ADMIN_PASSWORD not set in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Safe comparison with trim
        const isUsernameMatch = username && username.trim() === envUsername.trim();
        const isPasswordMatch = password && password.trim() === envPassword.trim();

        if (isUsernameMatch && isPasswordMatch) {
            console.log('Login Successful');
            // Use a static ID for the admin since we are not using DB
            const staticId = '000000000000000000000000';

            res.json({
                _id: staticId,
                username: envUsername,
                token: generateToken(staticId)
            });
        } else {
            console.log('Login Failed: Mismatch');
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { authAdmin };
