import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hunterName: '',
        hunterId: '',
        academyMail: '',
        rankLevel: 'II',
        department: '',
        squad: '',
        communicationRune: ''
    });
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePreview = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };

    const [status, setStatus] = useState({
        open: true,
        message: '',
        year2Open: true,
        year3Open: true,
        year4Open: true
    });
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    React.useEffect(() => {
        const checkStatus = async () => {
            try {
                const { data } = await api.get('/hunters/status');
                if (!data.registrationOpen) {
                    setStatus({ open: false, message: 'GATE SEALED BY ORDER OF THE GUILD' });
                } else if (data.currentCount >= data.registrationLimit) {
                    setStatus({ open: false, message: 'DUNGEON FULL - LIMIT REACHED' });
                } else {
                    setStatus({
                        open: true,
                        message: '',
                        year2Open: data.year2Open !== undefined ? data.year2Open : true,
                        year3Open: data.year3Open !== undefined ? data.year3Open : true,
                        year4Open: data.year4Open !== undefined ? data.year4Open : true
                    });
                }
            } catch (error) {
                console.error('Status Check Failed');
            } finally {
                setIsLoadingStatus(false);
            }
        };
        checkStatus();
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            await api.post('/hunters/register', formData);
            setIsSubmitted(true);
            setShowPreview(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed. Try again.");
            setShowPreview(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingStatus) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">INITIALIZING GATE LINK...</div>;
    }

    if (!status.open) {
        return (
            <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden">
                <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale" style={{ backgroundImage: "url('/bg.jpg')" }}>
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                </div>
                <div className="relative z-10 border border-red-500/50 p-12 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)] bg-black/80 max-w-lg w-full">
                    <h1 className="text-4xl font-display text-red-500 mb-4 tracking-widest uppercase animate-pulse">🚫 GATE CLOSED 🚫</h1>
                    <p className="text-gray-400 font-mono text-lg border-t border-red-900/50 pt-6">
                        {status.message}
                    </p>
                    <p className="text-red-400/60 text-xs mt-4 uppercase tracking-[0.2em]">
                        NO FURTHER REGISTRATIONS ACCEPTED
                    </p>
                    <button onClick={() => navigate('/')} className="mt-8 px-6 py-2 border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-all rounded uppercase text-sm">
                        Return
                    </button>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden">
                {/* Background Image */}
                <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.jpg')" }}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 border border-cyan-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] bg-black/60 backdrop-blur-md max-w-md w-full"
                >
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500 shadow-[0_0_20px_#22d3ee]">
                        <span className="text-3xl text-cyan-400">✓</span>
                    </div>
                    <h1 className="text-3xl font-display text-white mb-2 tracking-widest uppercase">Request Received</h1>
                    <p className="text-cyan-300 text-sm mb-4 font-mono border-b border-white/10 pb-4">
                        A verification scroll has been sent to<br />
                        <span className="text-white font-bold">{formData.academyMail}</span>
                    </p>
                    <p className="text-gray-400 text-xs mb-8">
                        Your application is under process. It will be verified shortly, and you will receive an email confirmation.
                        <br /><br />
                        <strong>Join the WhatsApp group below for mandatory updates.</strong>
                    </p>

                    <a
                        href="https://chat.whatsapp.com/K32X11n8XrgIrdcSCKq3Cs?mode=gi_t"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full text-center mb-2 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] uppercase tracking-wider group"
                    >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Join Guild (WhatsApp)
                    </a>

                    <p className="text-red-400 text-xs font-bold uppercase tracking-widest bg-red-900/20 p-2 rounded mb-6 border border-red-500/30 animate-pulse">
                        ⚠ WARNING: IT IS COMPULSORY TO JOIN THE WHATSAPP GROUP
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-2 w-full py-3 bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-900/30 transition-all rounded-lg uppercase tracking-wide text-sm"
                    >
                        Return to Gate
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative text-white font-main overflow-x-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.jpg')" }}>
                <div className="absolute inset-0 bg-black/80"></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2 drop-shadow-[0_0_10px_rgba(192,132,252,0.3)]">
                            HUNTER PROFILE
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base tracking-[0.3em] uppercase">Initialize Your Existence</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg mb-8 text-center backdrop-blur-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handlePreview} className="space-y-6 bg-black/40 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(118,39,220,0.1)]">

                        {/* Input Group */}
                        <div className="space-y-6">
                            <div className="group relative">
                                <label className="block text-cyan-400/80 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Hunter Name</label>
                                <input
                                    type="text" name="hunterName" required
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all duration-300 placeholder-gray-600"
                                    placeholder="Enter your full name"
                                    value={formData.hunterName} onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-cyan-400/80 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Hunter ID</label>
                                    <input
                                        type="text" name="hunterId" required
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all duration-300 placeholder-gray-600 font-mono"
                                        placeholder="Reg. Number"
                                        value={formData.hunterId} onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-cyan-400/80 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Academy Mail</label>
                                    <input
                                        type="email" name="academyMail" required
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all duration-300 placeholder-gray-600"
                                        placeholder="College Email"
                                        value={formData.academyMail} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="group relative">
                                <label className="block text-cyan-400/80 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Department (e.g. CSE, ECE)</label>
                                <input
                                    type="text" name="department" required
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all duration-300 placeholder-gray-600 tracking-widest uppercase"
                                    placeholder="e.g. CSE"
                                    value={formData.department} onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-cyan-400/80 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Rank (Year)</label>
                                    <div className="relative">
                                        <select
                                            name="rankLevel"
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none appearance-none transition-all duration-300 cursor-pointer"
                                            value={formData.rankLevel} onChange={handleChange}
                                        >
                                            <option value="II" disabled={!status.year2Open}>
                                                II {!status.year2Open ? '(Slots Filled)' : ''}
                                            </option>
                                            <option value="III" disabled={!status.year3Open}>
                                                III {!status.year3Open ? '(Slots Filled)' : ''}
                                            </option>
                                            <option value="IV" disabled={!status.year4Open}>
                                                IV {!status.year4Open ? '(Slots Filled)' : ''}
                                            </option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">
                                            ▼
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-cyan-400/80 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Section (e.g. 22S02)</label>
                                    <input
                                        type="text" name="squad" required
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all duration-300 placeholder-gray-600 uppercase"
                                        placeholder="e.g. 22S02"
                                        value={formData.squad} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-cyan-400/80 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Communication Rune</label>
                                <input
                                    type="tel" name="communicationRune" required
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all duration-300 placeholder-gray-600"
                                    placeholder="WhatsApp Number"
                                    value={formData.communicationRune} onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button (Triggers Preview) */}
                        <button
                            type="submit" disabled={isSubmitting}
                            className="w-full py-5 mt-4 bg-gradient-to-r from-purple-800 to-indigo-900 rounded-xl text-white font-bold tracking-[0.2em] uppercase hover:shadow-[0_0_30px_#7627dc] border border-purple-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10">REVIEW IDENTITY</span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowPreview(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative z-60 bg-gray-900 border border-cyan-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] max-w-lg w-full"
                        >
                            <h2 className="text-2xl font-display text-cyan-400 mb-6 border-b border-gray-700 pb-2">CONFIRM DETAILS</h2>

                            <div className="space-y-4 mb-8 text-sm md:text-base">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Name:</span>
                                    <span className="text-white font-bold text-right">{formData.hunterName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">ID:</span>
                                    <span className="text-white font-bold text-right font-mono">{formData.hunterId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Mail:</span>
                                    <span className="text-white font-bold text-right">{formData.academyMail}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Guild:</span>
                                    <span className="text-white font-bold text-right">{formData.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Rank(Year)/Squad:</span>
                                    <span className="text-white font-bold text-right">{formData.rankLevel} - {formData.squad}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Rune:</span>
                                    <span className="text-white font-bold text-right">{formData.communicationRune}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="flex-1 py-3 bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 rounded-lg uppercase tracking-wider text-sm transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase tracking-wider text-sm transition-all"
                                >
                                    {isSubmitting ? 'Sealing...' : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RegistrationPage;
