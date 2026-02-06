const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerHunter, getAllHunters, updateHunterStatus, deleteHunter, deleteAllHunters } = require('../controllers/hunterController');
const { protect, admin } = require('../middleware/authMiddleware'); // Need to create this

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'QR-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed!'));
    }
});

// Routes
const { getPublicSettings } = require('../controllers/hunterController');
router.get('/status', getPublicSettings);
router.post('/register', registerHunter);
router.get('/', protect, admin, getAllHunters);
router.put('/:id/status', protect, admin, updateHunterStatus);
const { exportHunters } = require('../controllers/hunterController');
router.get('/export', protect, admin, exportHunters);
router.delete('/:id', protect, admin, deleteHunter);
router.delete('/', protect, admin, deleteAllHunters);

module.exports = router;
