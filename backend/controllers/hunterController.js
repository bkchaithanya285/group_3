const Hunter = require('../models/Hunter');
const { sendPendingEmail, sendMilestoneEmail } = require('../utils/emailService');
const { getSettingsDoc } = require('./settingsController');

// @desc    Register a new hunter
// @route   POST /api/hunters/register
// @access  Public
const registerHunter = async (req, res) => {
    try {
        // Parallelize Checks for Speed
        const [settings, currentCount, hunterExists] = await Promise.all([
            getSettingsDoc(),
            Hunter.countDocuments(),
            Hunter.findOne({ $or: [{ hunterId }, { academyMail }] }).lean() // lean() for speed
        ]);

        // 1. Check if Registration is Open
        if (!settings.registrationOpen) {
            return res.status(400).json({ message: 'Gate Sealed: Registration is currently closed.' });
        }

        // 2. Check Limit
        if (currentCount >= settings.registrationLimit) {
            return res.status(400).json({ message: 'Dungeon Full: Registration limit reached.' });
        }

        const {
            hunterName,
            hunterId,
            academyMail,
            rankLevel,
            department,
            squad,
            communicationRune
        } = req.body;

        // 3. Check Duplicates
        if (hunterExists) {
            return res.status(400).json({ message: 'Hunter already registered' });
        }

        const hunter = await Hunter.create({
            hunterName,
            hunterId,
            academyMail,
            rankLevel,
            department,
            squad,
            communicationRune,
            joinedGuild: false // Set to false initially, they join via WhatsApp link after registration
        });

        if (hunter) {
            // Send Email (Async, don't wait for response)
            sendPendingEmail(hunter);

            // Milestone Check (Async)
            const newCount = currentCount + 1;
            if ([50, 75, 100, 125, 150].includes(newCount)) {
                sendMilestoneEmail(newCount, hunter);
            }

            res.status(201).json({
                _id: hunter._id,
                hunterName: hunter.hunterName,
                message: 'Registration Received'
            });
        } else {
            res.status(400).json({ message: 'Invalid hunter data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { sendApprovalEmail } = require('../utils/emailService');

const getAllHunters = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            $or: [
                { hunterName: { $regex: req.query.keyword, $options: 'i' } },
                { hunterId: { $regex: req.query.keyword, $options: 'i' } },
            ]
        } : {};

        const hunters = await Hunter.find({ ...keyword }).sort({ createdAt: -1 });
        res.json(hunters);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateHunterStatus = async (req, res) => {
    try {
        const { status } = req.body; // approved or rejected
        const hunter = await Hunter.findById(req.params.id);

        if (hunter) {
            hunter.status = status;
            const updatedHunter = await hunter.save();

            // Send email if approved
            if (status === 'approved') {
                sendApprovalEmail(updatedHunter);
            }

            res.json(updatedHunter);
        } else {
            res.status(404).json({ message: 'Hunter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const exportHunters = async (req, res) => {
    try {
        const hunters = await Hunter.find({}).lean();

        const data = hunters.map(h => ({
            'Hunter Name': h.hunterName,
            'Hunter ID': h.hunterId,
            'Academy Mail': h.academyMail,
            'Rank Level': h.rankLevel,
            'Hunter Guild': h.department,
            'Squad': h.squad,
            'Communication Rune': h.communicationRune,
            'Status': h.status,
            'Registered At': h.createdAt.toLocaleString()
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Hunters");

        const filePath = path.join(__dirname, '../uploads', 'CyberNova_Registrations.xlsx');
        xlsx.writeFile(wb, filePath);

        res.download(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Export failed' });
    }
};

const deleteHunter = async (req, res) => {
    try {
        const hunter = await Hunter.findById(req.params.id);

        if (hunter) {
            await hunter.deleteOne();
            res.json({ message: 'Hunter removed' });
        } else {
            res.status(404).json({ message: 'Hunter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteAllHunters = async (req, res) => {
    try {
        await Hunter.deleteMany({});
        res.json({ message: 'All hunters purged from the system' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerHunter, getAllHunters, updateHunterStatus, exportHunters, deleteHunter, deleteAllHunters };
