'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ---------- Types & Static Data ---------- */
type MenuItem = {
    id: string;
    label: string;
    icon?: string;
};

const menuItems: MenuItem[] = [
    { id: 'profile', label: 'PROFILE', icon: '👤' },
    { id: 'skills', label: 'SKILLS', icon: '⚡' },
    { id: 'projects', label: 'PROJECTS', icon: '🚀' },
    { id: 'contact', label: 'CONTACT', icon: '📡' },
    { id: 'exit', label: 'EXIT', icon: '🚪' },
];

const profileStats = [
    { label: 'LEVEL', value: '20', colorClass: 'text-yellow-400', shadow: 'shadow-yellow-400/50' },
    { label: 'STREET CRED', value: 'BEGINNER', colorClass: 'text-cyan-400', shadow: 'shadow-cyan-400/50' },
    { label: 'REPUTATION', value: 'NOOB', colorClass: 'text-pink-500', shadow: 'shadow-pink-500/50' },
];

const skillsData = [
    { name: 'UNITY 3D', level: 95, category: 'ENGINE', color: 'from-cyan-500 to-blue-500' },
    { name: 'UNREAL ENGINE', level: 88, category: 'ENGINE', color: 'from-purple-500 to-pink-500' },
    { name: 'C# SCRIPTING', level: 92, category: 'CODE', color: 'from-green-400 to-emerald-600' },
    { name: 'BLENDER', level: 85, category: 'ART', color: 'from-orange-400 to-red-500' },
    { name: 'GAME DESIGN', level: 90, category: 'DESIGN', color: 'from-yellow-400 to-amber-600' },
    { name: 'VR/AR', level: 78, category: 'TECH', color: 'from-indigo-400 to-violet-600' },
];

const projectsData = [
    {
        name: 'CYBER RUNNER',
        status: 'COMPLETED',
        description: 'Fast-paced 3D endless runner with cyberpunk aesthetics. Features procedural generation and neon visuals.',
        tech: ['Unity', 'C#', 'Shader Graph'],
        image: 'linear-gradient(45deg, #00f3ff, #ff00ff)',
    },
    {
        name: 'MYSTIC REALMS',
        status: 'IN DEVELOPMENT',
        description: 'Open-world RPG with dynamic weather system and AI-driven NPCs. Built with Unreal Engine 5.',
        tech: ['Unreal Engine', 'Blueprint', 'C++'],
        image: 'linear-gradient(45deg, #a855f7, #ec4899)',
    },
    {
        name: 'VR SPACE STATION',
        status: 'PROTOTYPE',
        description: 'Immersive VR experience aboard a futuristic space station. Interactive zero-gravity mechanics.',
        tech: ['Unity XR', 'Oculus SDK', 'C#'],
        image: 'linear-gradient(45deg, #3b82f6, #10b981)',
    },
];

/* ---------- Helper Functions ---------- */
function createArtifacts(count = 6) {
    return Array.from({ length: count }).map((_, i) => ({
        id: `artifact-${i}`,
        left: Math.random() * 100,
        top: Math.random() * 100,
        width: Math.random() * 4 + 2,
        height: Math.random() * 40 + 10,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
    }));
}

/* ---------- Main Component ---------- */
export default function GameDevPage() {
    const [activeMenu, setActiveMenu] = useState('profile');
    const [glitchActive, setGlitchActive] = useState(false);
    const [flickerElements, setFlickerElements] = useState<string[]>([]);
    const artifacts = useMemo(() => createArtifacts(6), []);

    // Optimized scanline animation using CSS variables for performance
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Glitch effect loop
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 100 + Math.random() * 100);
            }
        }, 3000);

        // Flicker effect loop
        const flickerInterval = setInterval(() => {
            const elements = ['logo', 'menu', 'status', 'border'];
            const target = elements[Math.floor(Math.random() * elements.length)] as string;
            setFlickerElements(prev => [...prev, target]);

            setTimeout(() => {
                setFlickerElements(prev => prev.filter(e => e !== target));
            }, 50 + Math.random() * 100);
        }, 2000);

        return () => {
            clearInterval(glitchInterval);
            clearInterval(flickerInterval);
        };
    }, []);

    const renderContent = () => {
        switch (activeMenu) {
            case 'profile': return <ProfileContent flicker={flickerElements.includes('profile')} />;
            case 'skills': return <SkillsContent />;
            case 'projects': return <ProjectsContent />;
            case 'contact': return <ContactContent />;
            default: return <ProfileContent />;
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white cyberpunk-font overflow-hidden relative selection:bg-cyan-500 selection:text-black">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            {/* Grid Overlay */}
            <div className="fixed inset-0 perspective-1000 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyan-900/20 to-transparent" />
            </div>

            {/* Scanline */}
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                <div className="w-full h-1 bg-cyan-400/30 blur-sm absolute top-0 animate-scanline shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            </div>

            {/* Floating Artifacts */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {artifacts.map(a => (
                    <motion.div
                        key={a.id}
                        className="absolute bg-cyan-500/20 backdrop-blur-sm"
                        style={{
                            width: a.width,
                            height: a.height,
                            left: `${a.left}%`,
                            top: `${a.top}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: a.duration,
                            repeat: Infinity,
                            delay: a.delay,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Main Layout */}
            <div className="relative z-10 flex flex-col md:flex-row h-screen">
                {/* Sidebar */}
                <aside className="w-full md:w-80 bg-black/40 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col relative overflow-hidden">
                    {/* Decorative Sidebar Line */}
                    <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />

                    <div className="p-8">
                        {/* Logo Area */}
                        <div className={`mb-12 relative group ${flickerElements.includes('logo') ? 'opacity-60' : 'opacity-100'}`}>
                            <div className="absolute -inset-2 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 tracking-tighter relative z-10 cyberpunk-logo" style={{ textShadow: '0 0 20px rgba(250, 204, 21, 0.3)' }}>
                                CYBER<br />PUNK
                            </h1>
                            <div className="text-xs text-cyan-400 tracking-[0.4em] mt-1 font-mono pl-1">2077 EDITION</div>

                            {/* Glitch Overlay for Logo */}
                            {glitchActive && (
                                <div className="absolute inset-0 text-red-500 font-black text-4xl tracking-tighter opacity-50 translate-x-[2px] pointer-events-none mix-blend-screen">
                                    CYBER<br />PUNK
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-3">
                            {menuItems.map((item) => {
                                const isActive = activeMenu === item.id;
                                const isExit = item.id === 'exit';

                                if (isExit) {
                                    return (
                                        <Link key={item.id} href="/" className="block mt-8">
                                            <motion.div
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="relative overflow-hidden group border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 p-4 cursor-pointer transition-all"
                                            >
                                                <div className="absolute inset-0 bg-red-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                                <div className="flex items-center justify-between relative z-10">
                                                    <span className="text-red-400 font-bold tracking-widest group-hover:text-red-300 transition-colors">SYSTEM EXIT</span>
                                                    <span className="text-red-500 text-xl">⏻</span>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    );
                                }

                                return (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => setActiveMenu(item.id)}
                                        className={`w-full text-left p-4 relative overflow-hidden group transition-all duration-300 ${isActive ? 'bg-cyan-900/20 border-r-4 border-cyan-400' : 'hover:bg-white/5 border-r-4 border-transparent'}`}
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className={`text-lg ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-300'}`}>{item.icon}</span>
                                            <span className={`font-bold tracking-wider ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{item.label}</span>
                                        </div>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeGlow"
                                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer Status */}
                    <div className="mt-auto p-6 border-t border-white/10 bg-black/60">
                        <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                ONLINE
                            </span>
                            <span>V.2.0.77</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 relative flex flex-col overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50">
                    {/* Header */}
                    <header className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 relative z-20">
                        <div className="flex items-center gap-6">
                            <div className="hidden md:block">
                                <div className="text-xs text-cyan-500 tracking-widest mb-1">OPERATOR</div>
                                <div className="text-white font-bold tracking-wider">MUHAMMAD BASIL C.P</div>
                            </div>
                            <div className="h-8 w-[1px] bg-white/20 hidden md:block" />
                            <div className="px-3 py-1 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-bold tracking-widest">
                                GAME DEV
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs text-gray-500 tracking-widest mb-1">LOCAL TIME</div>
                                <div className="text-white font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    </header>

                    {/* Content Container */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth relative">
                        {/* Content Background Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMenu}
                                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="max-w-5xl mx-auto relative z-10"
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Global Glitch Overlay */}
            <AnimatePresence>
                {glitchActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/5 mix-blend-overlay z-[100] pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-red-500/10 mix-blend-color-burn" />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes scanline {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scanline {
                    animation: scanline 4s linear infinite;
                }
            `}</style>
        </div>
    );
}

/* ---------- Subcomponents ---------- */

function ProfileContent({ flicker = false }: { flicker?: boolean }) {
    return (
        <div className="space-y-8">
            <div className={`relative p-8 border border-cyan-500/30 bg-black/60 backdrop-blur-md overflow-hidden group transition-all duration-300 ${flicker ? 'opacity-80 translate-x-1' : ''}`}>
                <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500/50" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500 to-transparent opacity-50" />

                <h2 className="text-4xl font-black text-white mb-8 tracking-tighter flex items-center gap-4">
                    <span className="text-cyan-400 text-5xl">01</span>
                    PROFILE_DATA
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {profileStats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`border border-white/10 bg-white/5 p-6 relative overflow-hidden group hover:border-white/30 transition-colors`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.colorClass.replace('text-', 'from-')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                            <div className="text-xs text-gray-400 mb-2 tracking-widest">{stat.label}</div>
                            <div className={`text-3xl font-black ${stat.colorClass} drop-shadow-lg`}>{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-8">
                    <h3 className="text-xl text-yellow-400 font-bold mb-4 tracking-widest">BIO_LOG</h3>
                    <p className="text-gray-300 leading-relaxed text-lg font-light max-w-3xl">
                        Experienced game developer specializing in <span className="text-cyan-400 font-medium">immersive 3D experiences</span> and cutting-edge interactive technologies. Passionate about creating worlds that blur the line between reality and digital dreams.
                    </p>
                </div>
            </div>
        </div>
    );
}

function SkillsContent() {
    return (
        <div className="space-y-8">
            <div className="border border-cyan-500/30 bg-black/60 backdrop-blur-md p-8 relative">
                <div className="absolute top-0 right-0 p-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                        <div className="w-2 h-2 bg-pink-500 rounded-full" />
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    </div>
                </div>

                <h2 className="text-4xl font-black text-white mb-8 tracking-tighter flex items-center gap-4">
                    <span className="text-pink-500 text-5xl">02</span>
                    SKILL_MATRIX
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillsData.map((skill, idx) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/5 border border-white/10 p-5 hover:border-cyan-500/50 transition-colors group"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-white font-bold tracking-wide">{skill.name}</span>
                                <span className="text-xs border border-white/20 px-2 py-1 rounded text-gray-400 group-hover:text-white group-hover:border-white/40 transition-all">{skill.category}</span>
                            </div>

                            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${skill.color}`}
                                />
                            </div>
                            <div className="text-right mt-1">
                                <span className="text-xs font-mono text-gray-400">{skill.level}% SYNCHRONIZATION</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProjectsContent() {
    return (
        <div className="space-y-8">
            <div className="border border-cyan-500/30 bg-black/60 backdrop-blur-md p-8">
                <h2 className="text-4xl font-black text-white mb-8 tracking-tighter flex items-center gap-4">
                    <span className="text-yellow-400 text-5xl">03</span>
                    PROJECT_DB
                </h2>

                <div className="grid gap-8">
                    {projectsData.map((project, i) => (
                        <motion.div
                            key={project.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative border border-white/10 bg-black/40 p-6 hover:border-cyan-500/50 transition-all overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                <div className="w-full md:w-48 h-32 rounded bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                                    <div className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity">🎮</div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{project.name}</h3>
                                        <span className={`text-xs px-3 py-1 border rounded-full font-bold ${project.status === 'COMPLETED' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                                                project.status === 'IN DEVELOPMENT' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                                                    'border-blue-500/50 text-blue-400 bg-blue-500/10'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((t, idx) => (
                                            <span key={idx} className="text-xs border border-white/10 bg-white/5 px-2 py-1 text-gray-300 group-hover:border-pink-500/30 group-hover:text-pink-400 transition-colors">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ContactContent() {
    return (
        <div className="space-y-8">
            <div className="border border-cyan-500/30 bg-black/60 backdrop-blur-md p-8">
                <h2 className="text-4xl font-black text-white mb-8 tracking-tighter flex items-center gap-4">
                    <span className="text-green-500 text-5xl">04</span>
                    COMMS_LINK
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: 'EMAIL', value: 'muhammadbasil@example.com', href: 'mailto:muhammadbasil@example.com', color: 'text-cyan-400', border: 'hover:border-cyan-500' },
                        { title: 'LINKEDIN', value: 'Connect Network', href: 'https://www.linkedin.com/in/muhammed-basil-cp-cse007', color: 'text-blue-400', border: 'hover:border-blue-500' },
                        { title: 'GITHUB', value: 'Source Codes', href: 'https://github.com/muhammadbasil', color: 'text-purple-400', border: 'hover:border-purple-500' }
                    ].map((item, i) => (
                        <motion.a
                            key={item.title}
                            href={item.href}
                            target={item.title === 'EMAIL' ? undefined : "_blank"}
                            rel="noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`border border-white/10 bg-white/5 p-8 group transition-all duration-300 ${item.border} hover:bg-white/10`}
                        >
                            <div className={`text-sm tracking-widest mb-2 ${item.color} font-bold`}>{item.title}</div>
                            <div className="text-xl text-white group-hover:translate-x-2 transition-transform">{item.value}</div>
                            <div className="mt-4 w-8 h-[2px] bg-gray-700 group-hover:w-full group-hover:bg-white transition-all duration-500" />
                        </motion.a>
                    ))}

                    <div className="border border-green-500/30 bg-green-900/10 p-8 flex flex-col justify-center items-center text-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-ping mb-4" />
                        <div className="text-green-400 font-bold tracking-widest text-lg">STATUS: AVAILABLE</div>
                        <div className="text-green-500/60 text-xs mt-2">OPEN FOR CONTRACTS</div>
                    </div>
                </div>
            </div>
        </div>
    );
}