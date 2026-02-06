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

        // HARDCODED CREDENTIALS (BYPASSING ENV)
        const envUsername = 'CYBERNOVA';
        const envPassword = 'ONEPIECE@CYBERNOVAA';

        console.log('--- DEBUG LOGIN ---');
        console.log(`Received: '${username}' (${username ? username.length : 0}) / '${password}' (${password ? password.length : 0})`);
        console.log(`Expected: '${envUsername}' (${envUsername.length}) / '${envPassword}' (${envPassword.length})`);

        // Safe comparison
        const isUsernameMatch = username && username.trim() === envUsername.trim();
        const isPasswordMatch = password && password.trim() === envPassword.trim();

        console.log(`Match: User=${isUsernameMatch}, Pass=${isPasswordMatch}`);

        if (isUsernameMatch && isPasswordMatch) {
            // Use a static ID for the admin since we are not using DB
            const staticId = '000000000000000000000000';

            res.json({
                _id: staticId,
                username: envUsername,
                token: generateToken(staticId)
            });
        } else {
            console.log('Login Failed: Mismatch');
            res.status(401).json({ message: 'Invalid credentials - Check Server Logs' });
        }
    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = { authAdmin };
