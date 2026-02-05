import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative text-center text-white overflow-hidden">
            {/* Background Image */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/bg.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/60"></div> {/* Dark Overlay */}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10 space-y-12">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <p className="text-xl md:text-2xl text-cyan-300 font-light tracking-[0.2em] uppercase">
                        Welcome, Hunter
                    </p>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#7627dc] via-purple-400 to-[#2de2e6] drop-shadow-[0_0_20px_rgba(118,39,220,0.6)] font-display uppercase leading-tight">
                        CYBERNOVA<br />SERIES
                    </h1>
                </motion.div>

                {/* Guild Alliances (Logos) - MOVED UP */}
                <div className="relative z-10 w-full max-w-4xl">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
                        <p className="text-center text-cyan-300 text-xs md:text-sm font-display uppercase tracking-[0.4em] drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                            In Alliance With
                        </p>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
                    </div>
                    <div className="flex justify-center items-center gap-8 flex-wrap">
                        {/* Light Cards for Logos */}
                        <div className="bg-white/90 p-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform duration-300 cursor-help backdrop-blur-sm">
                            <img src="/cybernerds.png" alt="CyberNerds" className="h-16 md:h-20 object-contain" />
                        </div>
                        <div className="bg-white/90 p-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform duration-300 cursor-help backdrop-blur-sm">
                            <img src="/owasp.png" alt="OWASP" className="h-16 md:h-20 object-contain" />
                        </div>
                    </div>
                </div>

                {/* Event Schedule (Minimal & Glowing) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-2 w-full max-w-2xl"
                >
                    <h2 className="text-xl md:text-2xl text-purple-400 font-display mb-2 uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                        Deployment Window
                    </h2>
                    <div className="text-center">
                        <p className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] tracking-tighter uppercase font-display">
                            Feb 16 <span className="text-purple-500">-</span> Feb 19
                        </p>
                        <p className="text-xl md:text-2xl text-cyan-300 font-mono mt-2 tracking-widest text-shadow-[0_0_10px_#22d3ee]">
                            5:00 PM - 6:00 PM
                        </p>
                    </div>
                </motion.div>

                {/* CTA Section - MOVED TO BOTTOM */}
                <div className="relative z-10 text-center pb-12">
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-5 px-16 rounded-full text-2xl uppercase tracking-[0.2em] transition-all transform hover:scale-105 shadow-[0_0_40px_#7627dc] border-4 border-white/10"
                    >
                        Enter the Gate
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-4 animate-pulse">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500/50"></div>
                        <p className="text-red-400 text-xs md:text-sm font-mono uppercase tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">
                            &gt;&gt;&gt; SYSTEM MESSAGE: LIMITED SPOTS AVAILABLE &lt;&lt;&lt;
                        </p>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500/50"></div>
                    </div>
                </div>

                <div className="h-24"></div>
            </div>
        </div>
    );
};

export default LandingPage;
