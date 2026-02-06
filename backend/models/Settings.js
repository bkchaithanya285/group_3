const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    registrationOpen: {
        type: Boolean,
        default: true
    },
    registrationLimit: {
        type: Number,
        default: 100
    },
    year2Open: { type: Boolean, default: true },
    year3Open: { type: Boolean, default: true },
    year4Open: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
