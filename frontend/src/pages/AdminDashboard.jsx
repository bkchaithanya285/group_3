import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [hunters, setHunters] = useState([]);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        registrationOpen: true,
        registrationLimit: 100,
        year2Open: true,
        year3Open: true,
        year4Open: true
    });
    const [updatingSettings, setUpdatingSettings] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    // Modal State
    const [selectedHunter, setSelectedHunter] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchData();
        }
    }, [navigate, searchKeyword]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

            // Fetch Hunters
            const huntersRes = await api.get(`/hunters?keyword=${searchKeyword}`, config);
            setHunters(huntersRes.data);

            // Calculate Stats
            const total = huntersRes.data.length;
            const approved = huntersRes.data.filter(h => h.status === 'approved').length;
            const pending = huntersRes.data.filter(h => h.status === 'pending').length;
            const rejected = huntersRes.data.filter(h => h.status === 'rejected').length;
            setStats({ total, approved, pending, rejected });

            // Fetch Settings
            const settingsRes = await api.get('/admin/settings', config);
            setSettings(settingsRes.data);

            setLoading(false);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin');
            }
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };
            await api.put(`/hunters/${id}/status`, { status }, config);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('adminToken');
        if (!confirm('WARNING: Are you sure you want to PERMANENTLY DELETE this hunter data? This cannot be undone.')) return;

        try {
            await api.delete(`/hunters/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleDeleteAll = async () => {
        const token = localStorage.getItem('adminToken');
        if (!confirm('DANGER: This will delete ALL registered hunters. Are you absolutely sure?')) return;
        if (!confirm('FINAL WARNING: This action is irreversible. Valid data will be lost. Confirm execution?')) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.delete('/hunters', config);
            fetchData();
            alert('System Purged');
        } catch (error) {
            console.error(error);
            alert('Purge failed');
        }
    };

    const handleSettingsUpdate = async () => {
        setUpdatingSettings(true);
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };
            await api.put('/admin/settings', settings, config);
            alert('Gate Protocols Updated');
        } catch (error) {
            console.error(error);
            alert('Failed to update settings');
        } finally {
            setUpdatingSettings(false);
        }
    };

    const handleExport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
                responseType: 'blob'
            };
            const response = await api.get('/hunters/export', config);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'CyberNova_Registrations.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error(error);
            alert('Export Failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-main relative">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                            OVERLORD DASHBOARD
                        </h1>
                        <p className="text-gray-400 text-sm tracking-widest mt-2">SYSTEM MONITORING ACTIVE</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDeleteAll}
                            className="bg-red-900/40 border border-red-500/50 text-red-400 px-6 py-2 rounded hover:bg-red-500/20 transition-all uppercase tracking-widest text-sm font-bold flex items-center gap-2"
                        >
                            <span>⚠</span> DELETE ALL DATA
                        </button>
                        <button onClick={handleLogout} className="text-gray-400 border border-gray-600 px-6 py-2 rounded hover:bg-gray-800 transition-all uppercase text-sm tracking-wider">
                            Terminate Session
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Total Hunters</h3>
                        <p className="text-4xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-green-900/50 backdrop-blur-sm">
                        <h3 className="text-green-400 text-xs uppercase tracking-widest mb-2">Approved</h3>
                        <p className="text-4xl font-bold text-green-400">{stats.approved}</p>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-yellow-900/50 backdrop-blur-sm">
                        <h3 className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Pending</h3>
                        <p className="text-4xl font-bold text-yellow-400">{stats.pending}</p>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-red-900/50 backdrop-blur-sm">
                        <h3 className="text-red-400 text-xs uppercase tracking-widest mb-2">Rejected</h3>
                        <p className="text-4xl font-bold text-red-400">{stats.rejected}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Settings */}
                    <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-bold text-cyan-400 mb-6 uppercase tracking-wider">Gate Control</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-gray-300">Registration Status</label>
                                <button
                                    onClick={() => setSettings({ ...settings, registrationOpen: !settings.registrationOpen })}
                                    className={`px-4 py-2 rounded font-bold transition-all ${settings.registrationOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                                >
                                    {settings.registrationOpen ? 'OPEN' : 'CLOSED'}
                                </button>
                            </div>

                            {/* Year Controls */}
                            <div className="space-y-3 pt-4 border-t border-gray-800">
                                <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Year Status (Rank)</h3>
                                <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                                    <span className="text-gray-300 text-sm">Year II</span>
                                    <button
                                        onClick={() => setSettings({ ...settings, year2Open: !settings.year2Open })}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${settings.year2Open ? 'bg-green-600/20 text-green-400 border border-green-600/50' : 'bg-red-600/20 text-red-400 border border-red-600/50'}`}
                                    >
                                        {settings.year2Open ? 'OPEN' : 'CLOSED'}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                                    <span className="text-gray-300 text-sm">Year III</span>
                                    <button
                                        onClick={() => setSettings({ ...settings, year3Open: !settings.year3Open })}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${settings.year3Open ? 'bg-green-600/20 text-green-400 border border-green-600/50' : 'bg-red-600/20 text-red-400 border border-red-600/50'}`}
                                    >
                                        {settings.year3Open ? 'OPEN' : 'CLOSED'}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                                    <span className="text-gray-300 text-sm">Year IV</span>
                                    <button
                                        onClick={() => setSettings({ ...settings, year4Open: !settings.year4Open })}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${settings.year4Open ? 'bg-green-600/20 text-green-400 border border-green-600/50' : 'bg-red-600/20 text-red-400 border border-red-600/50'}`}
                                    >
                                        {settings.year4Open ? 'OPEN' : 'CLOSED'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Max Hunter Limit</label>
                                <input
                                    type="number"
                                    value={settings.registrationLimit}
                                    onChange={(e) => setSettings({ ...settings, registrationLimit: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                                />
                            </div>
                            <button
                                onClick={handleSettingsUpdate}
                                disabled={updatingSettings}
                                className="w-full bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 py-3 rounded hover:bg-cyan-500/20 transition-all uppercase tracking-widest"
                            >
                                {updatingSettings ? 'Updating...' : 'Update Protocols'}
                            </button>
                        </div>
                    </div>

                    {/* Export / Search */}
                    <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-purple-400 mb-6 uppercase tracking-wider">Data Extraction</h2>
                            <p className="text-gray-500 text-sm mb-6">Download complete hunter registry in Excel format.</p>
                            <input
                                type="text"
                                placeholder="Search by Name or ID..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none mb-4"
                            />
                        </div>
                        <button
                            onClick={handleExport}
                            className="w-full bg-purple-900/30 border border-purple-500/50 text-purple-400 py-3 rounded hover:bg-purple-500/20 transition-all uppercase tracking-widest"
                        >
                            Export Data (.xlsx)
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-gray-900/30 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 border-b border-gray-700">Hunter Name</th>
                                    <th className="p-4 border-b border-gray-700">ID</th>
                                    <th className="p-4 border-b border-gray-700">Rank</th>
                                    <th className="p-4 border-b border-gray-700">Squad</th>
                                    <th className="p-4 border-b border-gray-700">Rune (Mobile)</th>
                                    <th className="p-4 border-b border-gray-700">Status</th>
                                    <th className="p-4 border-b border-gray-700">Actions</th>
                                    <th className="p-4 border-b border-gray-700">Details</th>
                                    <th className="p-4 border-b border-gray-700 text-right">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="9" className="p-8 text-center text-gray-500">Loading Data...</td></tr>
                                ) : (
                                    hunters.map((hunter) => (
                                        <tr key={hunter._id} className="border-b border-gray-800 hover:bg-white/5 transition-all">
                                            <td className="p-4 font-bold text-white">{hunter.hunterName}</td>
                                            <td className="p-4 text-cyan-300 font-mono">{hunter.hunterId}</td>
                                            <td className="p-4 text-gray-300">{hunter.rankLevel}</td>
                                            <td className="p-4 text-gray-300">{hunter.squad}</td>
                                            <td className="p-4 text-gray-400">{hunter.communicationRune}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${hunter.status === 'approved' ? 'bg-green-900/50 text-green-400' :
                                                    hunter.status === 'rejected' ? 'bg-red-900/50 text-red-400' :
                                                        'bg-yellow-900/50 text-yellow-400'
                                                    }`}>
                                                    {hunter.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {hunter.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleStatusUpdate(hunter._id, 'approved')} className="text-green-500 hover:text-green-300" title="Approve">✓</button>
                                                        <button onClick={() => handleStatusUpdate(hunter._id, 'rejected')} className="text-red-500 hover:text-red-300" title="Reject">✕</button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-600 text-xs uppercase tracking-widest">Locked</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => setSelectedHunter(hunter)}
                                                    className="text-cyan-400 hover:text-cyan-200 border border-cyan-500/30 px-3 py-1 rounded text-xs uppercase hover:bg-cyan-900/30 transition-all"
                                                >
                                                    View
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(hunter._id)}
                                                    className="px-3 py-1 bg-gray-600/20 text-gray-400 border border-gray-600 hover:bg-red-600 hover:text-white transition text-xs"
                                                    title="Delete Data"
                                                >
                                                    🗑
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Modal */}
                <AnimatePresence>
                    {selectedHunter && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setSelectedHunter(null)}
                            ></motion.div>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative z-60 bg-gray-900 border border-purple-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(118,39,220,0.3)] max-w-lg w-full"
                            >
                                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                                    <h2 className="text-2xl font-display text-white">HUNTER DOSSIER</h2>
                                    <button onClick={() => setSelectedHunter(null)} className="text-gray-400 hover:text-white">✕</button>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between p-2 border-b border-gray-800">
                                        <span className="text-gray-400 uppercase text-xs tracking-widest">Name</span>
                                        <span className="text-white font-bold">{selectedHunter.hunterName}</span>
                                    </div>
                                    <div className="flex justify-between p-2 border-b border-gray-800">
                                        <span className="text-gray-400 uppercase text-xs tracking-widest">Reg ID</span>
                                        <span className="text-cyan-400 font-mono">{selectedHunter.hunterId}</span>
                                    </div>
                                    <div className="flex justify-between p-2 border-b border-gray-800">
                                        <span className="text-gray-400 uppercase text-xs tracking-widest">Email</span>
                                        <span className="text-white">{selectedHunter.academyMail}</span>
                                    </div>
                                    <div className="flex justify-between p-2 border-b border-gray-800">
                                        <span className="text-gray-400 uppercase text-xs tracking-widest">Department</span>
                                        <span className="text-white">{selectedHunter.department || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between p-2 border-b border-gray-800">
                                        <span className="text-gray-400 uppercase text-xs tracking-widest">Rank / Squad</span>
                                        <span className="text-white">{selectedHunter.rankLevel} / {selectedHunter.squad}</span>
                                    </div>
                                    <div className="flex justify-between p-2 border-b border-gray-800">
                                        <span className="text-gray-400 uppercase text-xs tracking-widest">Mobile</span>
                                        <span className="text-white">{selectedHunter.communicationRune}</span>
                                    </div>
                                    <div className="flex justify-between p-2 border-b border-gray-800">
                                        <span className="text-gray-400 uppercase text-xs tracking-widest">Status</span>
                                        <span className={`uppercase font-bold ${selectedHunter.status === 'approved' ? 'text-green-400' :
                                            selectedHunter.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                                            }`}>{selectedHunter.status}</span>
                                    </div>
                                    <div className="flex justify-between p-2">
                                        <span className="text-gray-400 uppercase text-xs tracking-widest">Registered</span>
                                        <span className="text-gray-500 text-xs">{new Date(selectedHunter.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Quick Actions in Modal */}
                                {selectedHunter.status === 'pending' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => { handleStatusUpdate(selectedHunter._id, 'rejected'); setSelectedHunter(null); }}
                                            className="py-3 bg-red-900/30 text-red-400 border border-red-500/30 rounded hover:bg-red-900/50 transition-all uppercase text-sm"
                                        >
                                            REJECT
                                        </button>
                                        <button
                                            onClick={() => { handleStatusUpdate(selectedHunter._id, 'approved'); setSelectedHunter(null); }}
                                            className="py-3 bg-green-900/30 text-green-400 border border-green-500/30 rounded hover:bg-green-900/50 transition-all uppercase text-sm"
                                        >
                                            APPROVE
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
