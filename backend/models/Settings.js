const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    registrationOpen: {
        type: Boolean,
        default: true
    },
    registrationLimit: {
        type: Number,
        default: 100
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
