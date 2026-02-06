import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Attempting login...');
        console.log('API Base URL:', api.defaults.baseURL); // DEBUG: Show user where we are connecting
        try {
            const { data } = await api.post('/admin/login', credentials);
            localStorage.setItem('adminToken', data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Connection Error (Backend Unreachable)');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-purple-900 p-8 rounded shadow-[0_0_20px_#7627dc]">
                <h2 className="text-3xl text-center text-purple-500 font-display mb-6">Guild Master Login (v1.5)</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="text" name="username" placeholder="Username" required
                            className="w-full bg-black border border-gray-700 p-3 text-white focus:border-purple-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="password" name="password" placeholder="Password" required
                            className="w-full bg-black border border-gray-700 p-3 text-white focus:border-purple-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-purple-900 text-white font-bold hover:bg-purple-800 transition">
                        ACCESS CONTROL PANEL
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
