const express = require('express');
const router = express.Router();
const { authAdmin } = require('../controllers/adminAuthController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);

// Settings Routes
router.get('/settings', protect, admin, getSettings);
router.put('/settings', protect, admin, updateSettings);

module.exports = router;
