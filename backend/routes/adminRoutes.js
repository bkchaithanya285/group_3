const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin } = require('../controllers/adminController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.post('/register', registerAdmin); // Keep for initial setup

// Settings Routes
router.get('/settings', protect, admin, getSettings);
router.put('/settings', protect, admin, updateSettings);

module.exports = router;
