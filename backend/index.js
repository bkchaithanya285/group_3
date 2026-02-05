const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // Limit each IP to 1000 requests to handle 100 concurrent users easily
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (Uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('CyberNova API Running');
});

// Import Routes
const hunterRoutes = require('./routes/hunterRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/hunters', hunterRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
