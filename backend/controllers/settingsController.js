const Settings = require('../models/Settings');

// Helper to get or create settings
const getSettingsDoc = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({
            registrationOpen: true,
            registrationLimit: 100,
            year2Open: true,
            year3Open: true,
            year4Open: true
        });
    }
    return settings;
};

const getSettings = async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { registrationOpen, registrationLimit } = req.body;
        let settings = await getSettingsDoc();

        if (registrationOpen !== undefined) settings.registrationOpen = registrationOpen;
        if (registrationLimit !== undefined) settings.registrationLimit = registrationLimit;
        if (req.body.year2Open !== undefined) settings.year2Open = req.body.year2Open;
        if (req.body.year3Open !== undefined) settings.year3Open = req.body.year3Open;
        if (req.body.year4Open !== undefined) settings.year4Open = req.body.year4Open;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getSettings, updateSettings, getSettingsDoc };
