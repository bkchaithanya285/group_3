const mongoose = require('mongoose');

const hunterSchema = new mongoose.Schema({
    hunterName: {
        type: String,
        required: true
    },
    hunterId: {
        type: String,
        required: true,
        unique: true
    },
    academyMail: {
        type: String,
        required: true,
        unique: true
    },
    rankLevel: {
        type: String,
        required: true,
        enum: ['II', 'III', 'IV']
    },
    department: {
        type: String,
        required: true
    },
    squad: {
        type: String,
        required: true
    },
    communicationRune: {
        type: String,
        required: true
    },
    joinedGuild: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Hunter', hunterSchema);
