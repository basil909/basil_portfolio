'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Menu items for the main navigation
const menuItems = [
    { id: 'profile', label: 'PROFILE', active: true },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'contact', label: 'CONTACT' },
    { id: 'exit', label: 'EXIT' }
];

// Profile stats data
const profileStats = [
    { label: 'LEVEL', value: '20', color: 'text-yellow-400' },
    { label: 'STREET CRED', value: 'BEGINNER', color: 'text-cyan-400' },
    { label: 'REPUTATION', value: 'NOOB', color: 'text-pink-500' }
];

// Skills data
const skillsData = [
    { name: 'UNITY 3D', level: 95, category: 'ENGINE' },
    { name: 'UNREAL ENGINE', level: 88, category: 'ENGINE' },
    { name: 'C# SCRIPTING', level: 92, category: 'CODE' },
    { name: 'BLENDER', level: 85, category: 'ART' },
    { name: 'GAME DESIGN', level: 90, category: 'DESIGN' },
    { name: 'VR/AR', level: 78, category: 'TECH' }
];

// Projects data
const projectsData = [
    {
        name: 'CYBER RUNNER',
        status: 'COMPLETED',
        description: 'Fast-paced 3D endless runner with cyberpunk aesthetics',
        tech: ['Unity', 'C#', 'Shader Graph']
    },
    {
        name: 'MYSTIC REALMS',
        status: 'IN DEVELOPMENT',
        description: 'Open-world RPG with dynamic weather system',
        tech: ['Unreal Engine', 'Blueprint', 'C++']
    },
    {
        name: 'VR SPACE STATION',
        status: 'PROTOTYPE',
        description: 'Immersive VR experience aboard a space station',
        tech: ['Unity XR', 'Oculus SDK', 'C#']
    }
];

export default function GameDevPage() {
    const [activeMenu, setActiveMenu] = useState('profile');
    // const [isLoaded, setIsLoaded] = useState(false); // Removed unused state
    const [glitchActive, setGlitchActive] = useState(false);
    const [flickerElements, setFlickerElements] = useState<string[]>([]);
    const [scanLinePosition, setScanLinePosition] = useState(0);

    useEffect(() => {
        // setIsLoaded(true); // Removed unused state update

        // Random glitch effect
        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 150);
        }, Math.random() * 8000 + 3000);

        // Reduced flickering elements - less frequent and shorter duration
        const flickerInterval = setInterval(() => {
            const elements = ['logo', 'menu'];
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            setFlickerElements(prev => [...prev, randomElement as string]);
            setTimeout(() => {
                setFlickerElements(prev => prev.filter(el => el !== randomElement));
            }, 50); // Reduced from 100ms to 50ms
        }, Math.random() * 8000 + 5000); // Increased interval

        // Slower scan line animation to reduce flickering
        const scanLineInterval = setInterval(() => {
            setScanLinePosition(prev => (prev + 0.5) % 100);
        }, 100); // Slower update rate

        return () => {
            clearInterval(glitchInterval);
            clearInterval(flickerInterval);
            clearInterval(scanLineInterval);
        };
    }, []);

    const renderContent = () => {
        switch (activeMenu) {
            case 'profile':
                return <ProfileContent />;
            case 'skills':
                return <SkillsContent />;
            case 'projects':
                return <ProjectsContent />;
            case 'contact':
                return <ContactContent />;
            default:
                return <ProfileContent />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white cyberpunk-font overflow-hidden relative">
            {/* Background with cyberpunk atmosphere */}
            <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-black to-cyan-900/20"></div>

            {/* Animated background elements */}
            <div className="fixed inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,0,111,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
            </div>

            {/* Dynamic scan lines */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.9)_50%)] bg-[size:4px_4px] opacity-20"></div>
                <motion.div
                    className="absolute left-0 w-full h-1 bg-cyan-400/50 blur-sm"
                    style={{ top: `${scanLinePosition}%` }}
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scaleX: [0.8, 1.2, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            {/* Reduced floating digital artifacts */}
            <div className="fixed inset-0 pointer-events-none">
                {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-cyan-400 opacity-40"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 20 + 5}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            filter: 'blur(0.5px)'
                        }}
                        animate={{
                            opacity: [0.4, 0, 0.4],
                            scaleY: [1, 0.7, 1],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                ))}
            </div>

            {/* Main container */}
            <div className="relative z-10 flex h-screen">
                {/* Left sidebar - Menu */}
                <div className="w-80 bg-black/80 backdrop-blur-sm border-r border-cyan-400/30 p-6">
                    {/* Logo with 3D effect and flickering */}
                    <motion.div
                        className={`mb-12 ${flickerElements.includes('logo') ? 'animate-pulse opacity-50' : ''}`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative">
                            <motion.h1
                                className="text-3xl font-bold text-yellow-400 mb-2 tracking-wider relative cyberpunk-logo"
                                style={{
                                    textShadow: `
                    2px 2px 0px #000,
                    4px 4px 0px rgba(255, 255, 0, 0.3),
                    6px 6px 10px rgba(255, 255, 0, 0.2),
                    0 0 20px rgba(255, 255, 0, 0.5)
                  `,
                                    transform: 'perspective(500px) rotateX(15deg)'
                                }}
                                animate={{
                                    textShadow: [
                                        '2px 2px 0px #000, 4px 4px 0px rgba(255, 255, 0, 0.3), 6px 6px 10px rgba(255, 255, 0, 0.2), 0 0 20px rgba(255, 255, 0, 0.5)',
                                        '2px 2px 0px #000, 4px 4px 0px rgba(255, 255, 0, 0.5), 6px 6px 10px rgba(255, 255, 0, 0.4), 0 0 30px rgba(255, 255, 0, 0.7)',
                                        '2px 2px 0px #000, 4px 4px 0px rgba(255, 255, 0, 0.3), 6px 6px 10px rgba(255, 255, 0, 0.2), 0 0 20px rgba(255, 255, 0, 0.5)'
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                CYBERPUNK
                                {/* Glitch overlay */}
                                <motion.span
                                    className="absolute inset-0 text-red-500"
                                    animate={{
                                        opacity: [0, 0.8, 0],
                                        x: [0, -2, 2, 0],
                                        skewX: [0, -5, 5, 0]
                                    }}
                                    transition={{
                                        duration: 0.1,
                                        repeat: Infinity,
                                        repeatDelay: Math.random() * 8 + 4
                                    }}
                                >
                                    CYBERPUNK
                                </motion.span>
                            </motion.h1>

                            <motion.div
                                className="text-sm text-cyan-400 tracking-[0.3em] relative cyberpunk-font"
                                style={{
                                    textShadow: `
                    1px 1px 0px #000,
                    2px 2px 0px rgba(0, 255, 255, 0.3),
                    3px 3px 5px rgba(0, 255, 255, 0.2),
                    0 0 15px rgba(0, 255, 255, 0.5)
                  `,
                                    transform: 'perspective(500px) rotateX(15deg)'
                                }}
                                animate={{
                                    textShadow: [
                                        '1px 1px 0px #000, 2px 2px 0px rgba(0, 255, 255, 0.3), 3px 3px 5px rgba(0, 255, 255, 0.2), 0 0 15px rgba(0, 255, 255, 0.5)',
                                        '1px 1px 0px #000, 2px 2px 0px rgba(0, 255, 255, 0.5), 3px 3px 5px rgba(0, 255, 255, 0.4), 0 0 25px rgba(0, 255, 255, 0.7)',
                                        '1px 1px 0px #000, 2px 2px 0px rgba(0, 255, 255, 0.3), 3px 3px 5px rgba(0, 255, 255, 0.2), 0 0 15px rgba(0, 255, 255, 0.5)'
                                    ]
                                }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                            >
                                2077
                            </motion.div>

                            <motion.div
                                className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-cyan-400"
                                animate={{
                                    width: [80, 100, 80],
                                    opacity: [0.7, 1, 0.7],
                                    boxShadow: [
                                        '0 0 5px rgba(255, 255, 0, 0.5)',
                                        '0 0 15px rgba(0, 255, 255, 0.8)',
                                        '0 0 5px rgba(255, 255, 0, 0.5)'
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    {/* Menu items with enhanced effects */}
                    <nav className={`space-y-2 ${flickerElements.includes('menu') ? 'animate-pulse opacity-70' : ''}`}>
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                {item.id === 'exit' ? (
                                    <Link href="/">
                                        <motion.div
                                            className="flex items-center p-3 cursor-pointer group border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 relative overflow-hidden"
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div
                                                className="w-2 h-2 bg-red-500 mr-3 opacity-70 group-hover:opacity-100 rounded-full"
                                                animate={{
                                                    opacity: [0.7, 1, 0.7],
                                                    scale: [1, 1.2, 1]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            <span
                                                className="text-red-400 group-hover:text-red-300 tracking-wider relative cyberpunk-menu"
                                                style={{
                                                    textShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                            {/* Hover glow effect */}
                                            <motion.div
                                                className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100"
                                                initial={{ scale: 0 }}
                                                whileHover={{ scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </motion.div>
                                    </Link>
                                ) : (
                                    <motion.div
                                        className={`flex items-center p-3 cursor-pointer group transition-all duration-200 relative overflow-hidden ${activeMenu === item.id
                                            ? 'border border-cyan-400 bg-cyan-400/10'
                                            : 'border border-gray-700/50 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                                            }`}
                                        onClick={() => setActiveMenu(item.id)}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <motion.div
                                            className={`w-2 h-2 mr-3 rounded-full ${activeMenu === item.id ? 'bg-cyan-400' : 'bg-gray-600 group-hover:bg-cyan-400'
                                                }`}
                                            animate={activeMenu === item.id ? {
                                                opacity: [1, 0.5, 1],
                                                scale: [1, 1.3, 1],
                                                boxShadow: [
                                                    '0 0 5px rgba(34, 211, 238, 0.5)',
                                                    '0 0 15px rgba(34, 211, 238, 0.8)',
                                                    '0 0 5px rgba(34, 211, 238, 0.5)'
                                                ]
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <span
                                            className={`tracking-wider relative cyberpunk-menu ${activeMenu === item.id ? 'text-cyan-400' : 'text-gray-300 group-hover:text-cyan-400'
                                                }`}
                                            style={{
                                                textShadow: activeMenu === item.id
                                                    ? '1px 1px 0px #000, 0 0 10px rgba(34, 211, 238, 0.5)'
                                                    : '1px 1px 0px #000'
                                            }}
                                        >
                                            {item.label}
                                            {/* Glitch effect for active item */}
                                            {activeMenu === item.id && (
                                                <motion.span
                                                    className="absolute inset-0 text-pink-500"
                                                    animate={{
                                                        opacity: [0, 0.6, 0],
                                                        x: [0, -1, 1, 0],
                                                        skewX: [0, -2, 2, 0]
                                                    }}
                                                    transition={{
                                                        duration: 0.15,
                                                        repeat: Infinity,
                                                        repeatDelay: Math.random() * 6 + 3
                                                    }}
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </span>

                                        {/* Active item glow */}
                                        {activeMenu === item.id && (
                                            <motion.div
                                                className="absolute inset-0 bg-cyan-400/5"
                                                animate={{ opacity: [0.05, 0.15, 0.05] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </nav>

                    {/* Bottom info */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="border-t border-gray-700 pt-4">
                            <div className="text-xs text-gray-500 mb-2">SYSTEM STATUS</div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-green-400 text-sm">ONLINE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 relative">
                    {/* Top bar with enhanced 3D text */}
                    <div className={`h-16 bg-black/60 backdrop-blur-sm border-b border-cyan-400/30 flex items-center justify-between px-8 ${flickerElements.includes('status') ? 'animate-pulse opacity-80' : ''}`}>
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="text-cyan-400 text-sm tracking-wider relative cyberpunk-angular"
                                style={{
                                    textShadow: `
                    1px 1px 0px #000,
                    2px 2px 0px rgba(34, 211, 238, 0.3),
                    3px 3px 5px rgba(34, 211, 238, 0.2),
                    0 0 15px rgba(34, 211, 238, 0.4)
                  `,
                                    transform: 'perspective(300px) rotateX(10deg)'
                                }}
                                animate={{
                                    textShadow: [
                                        '1px 1px 0px #000, 2px 2px 0px rgba(34, 211, 238, 0.3), 3px 3px 5px rgba(34, 211, 238, 0.2), 0 0 15px rgba(34, 211, 238, 0.4)',
                                        '1px 1px 0px #000, 2px 2px 0px rgba(34, 211, 238, 0.5), 3px 3px 5px rgba(34, 211, 238, 0.4), 0 0 25px rgba(34, 211, 238, 0.6)',
                                        '1px 1px 0px #000, 2px 2px 0px rgba(34, 211, 238, 0.3), 3px 3px 5px rgba(34, 211, 238, 0.2), 0 0 15px rgba(34, 211, 238, 0.4)'
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                MUHAMMAD BASIL C.P
                                {/* Random glitch effect */}
                                <motion.span
                                    className="absolute inset-0 text-pink-500"
                                    animate={{
                                        opacity: [0, 0.7, 0],
                                        x: [0, -1, 1, 0],
                                        skewX: [0, -3, 3, 0]
                                    }}
                                    transition={{
                                        duration: 0.1,
                                        repeat: Infinity,
                                        repeatDelay: Math.random() * 12 + 6
                                    }}
                                >
                                    MUHAMMAD BASIL C.P
                                </motion.span>
                            </motion.div>

                            <motion.div
                                className="w-px h-6 bg-gray-600"
                                animate={{
                                    opacity: [0.6, 1, 0.6],
                                    scaleY: [1, 1.2, 1]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />

                            <motion.div
                                className="text-yellow-400 text-sm tracking-wider relative cyberpunk-angular"
                                style={{
                                    textShadow: `
                    1px 1px 0px #000,
                    2px 2px 0px rgba(250, 204, 21, 0.3),
                    3px 3px 5px rgba(250, 204, 21, 0.2),
                    0 0 15px rgba(250, 204, 21, 0.4)
                  `,
                                    transform: 'perspective(300px) rotateX(10deg)'
                                }}
                                animate={{
                                    textShadow: [
                                        '1px 1px 0px #000, 2px 2px 0px rgba(250, 204, 21, 0.3), 3px 3px 5px rgba(250, 204, 21, 0.2), 0 0 15px rgba(250, 204, 21, 0.4)',
                                        '1px 1px 0px #000, 2px 2px 0px rgba(250, 204, 21, 0.5), 3px 3px 5px rgba(250, 204, 21, 0.4), 0 0 25px rgba(250, 204, 21, 0.6)',
                                        '1px 1px 0px #000, 2px 2px 0px rgba(250, 204, 21, 0.3), 3px 3px 5px rgba(250, 204, 21, 0.2), 0 0 15px rgba(250, 204, 21, 0.4)'
                                    ]
                                }}
                                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                            >
                                GAME DEVELOPER
                            </motion.div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.div
                                className="text-xs text-gray-400 cyberpunk-text"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {new Date().toLocaleTimeString()}
                            </motion.div>

                            <motion.div
                                className="w-3 h-3 bg-pink-500 rounded-full relative"
                                animate={{
                                    opacity: [1, 0.3, 1],
                                    scale: [1, 1.3, 1],
                                    boxShadow: [
                                        '0 0 5px rgba(236, 72, 153, 0.5)',
                                        '0 0 15px rgba(236, 72, 153, 0.8)',
                                        '0 0 5px rgba(236, 72, 153, 0.5)'
                                    ]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-pink-500 rounded-full"
                                    animate={{
                                        scale: [1, 2, 1],
                                        opacity: [0.5, 0, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="p-8 h-[calc(100vh-4rem)] overflow-y-auto scroll-smooth">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMenu}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className={glitchActive ? 'animate-pulse' : ''}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Glitch overlay */}
            {glitchActive && (
                <div className="fixed inset-0 bg-red-500/5 pointer-events-none z-50"></div>
            )}
        </div>
    );
}

// Profile Content Component with enhanced effects
const ProfileContent = () => {
    const [flickerStats, setFlickerStats] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomStat = Math.floor(Math.random() * 3);
            setFlickerStats([randomStat]);
            setTimeout(() => setFlickerStats([]), 100); // Shorter flicker
        }, Math.random() * 6000 + 4000); // Less frequent

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <motion.div
                className="border border-cyan-400/30 bg-black/40 p-6 relative overflow-hidden"
                animate={{
                    borderColor: ['rgba(34, 211, 238, 0.3)', 'rgba(34, 211, 238, 0.6)', 'rgba(34, 211, 238, 0.3)']
                }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                {/* Animated scan line */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-0.5 bg-cyan-400 opacity-70"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <motion.h2
                    className="text-2xl text-cyan-400 mb-6 tracking-wider relative cyberpunk-angular"
                    style={{
                        textShadow: `
              2px 2px 0px #000,
              4px 4px 0px rgba(34, 211, 238, 0.4),
              6px 6px 10px rgba(34, 211, 238, 0.3),
              0 0 20px rgba(34, 211, 238, 0.6)
            `,
                        transform: 'perspective(400px) rotateX(20deg)'
                    }}
                    animate={{
                        textShadow: [
                            '2px 2px 0px #000, 4px 4px 0px rgba(34, 211, 238, 0.4), 6px 6px 10px rgba(34, 211, 238, 0.3), 0 0 20px rgba(34, 211, 238, 0.6)',
                            '2px 2px 0px #000, 4px 4px 0px rgba(34, 211, 238, 0.7), 6px 6px 10px rgba(34, 211, 238, 0.5), 0 0 30px rgba(34, 211, 238, 0.9)',
                            '2px 2px 0px #000, 4px 4px 0px rgba(34, 211, 238, 0.4), 6px 6px 10px rgba(34, 211, 238, 0.3), 0 0 20px rgba(34, 211, 238, 0.6)'
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    PROFILE DATA
                    {/* Glitch overlay */}
                    <motion.span
                        className="absolute inset-0 text-pink-500"
                        animate={{
                            opacity: [0, 0.8, 0],
                            x: [0, -2, 2, 0],
                            skewX: [0, -5, 5, 0]
                        }}
                        transition={{
                            duration: 0.15,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 8 + 4
                        }}
                    >
                        PROFILE DATA
                    </motion.span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {profileStats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className={`border border-gray-700 bg-black/60 p-4 relative overflow-hidden ${flickerStats.includes(index) ? 'animate-pulse opacity-60' : ''
                                }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                borderColor: flickerStats.includes(index)
                                    ? ['rgba(107, 114, 128, 1)', 'rgba(34, 211, 238, 0.8)', 'rgba(107, 114, 128, 1)']
                                    : 'rgba(107, 114, 128, 1)'
                            }}
                            transition={{
                                delay: index * 0.1,
                                borderColor: { duration: 0.3 }
                            }}
                        >
                            {/* Flickering background */}
                            <motion.div
                                className="absolute inset-0 bg-cyan-400/5"
                                animate={{
                                    opacity: flickerStats.includes(index) ? [0, 0.3, 0] : 0
                                }}
                                transition={{ duration: 0.2 }}
                            />

                            <div className="text-xs text-gray-400 mb-1 relative z-10">{stat.label}</div>
                            <motion.div
                                className={`text-2xl font-bold ${stat.color} relative z-10`}
                                style={{
                                    textShadow: `
                    1px 1px 0px #000,
                    2px 2px 0px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.3)' :
                                            stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.3)' :
                                                'rgba(236, 72, 153, 0.3)'},
                    3px 3px 5px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.2)' :
                                            stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.2)' :
                                                'rgba(236, 72, 153, 0.2)'},
                    0 0 15px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.5)' :
                                            stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.5)' :
                                                'rgba(236, 72, 153, 0.5)'}
                  `,
                                    transform: 'perspective(300px) rotateX(15deg)'
                                }}
                                animate={flickerStats.includes(index) ? {
                                    scale: [1, 1.1, 1],
                                    textShadow: [
                                        `1px 1px 0px #000, 2px 2px 0px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.3)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(236, 72, 153, 0.3)'}, 3px 3px 5px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.2)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(236, 72, 153, 0.2)'}, 0 0 15px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.5)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.5)' : 'rgba(236, 72, 153, 0.5)'}`,
                                        `1px 1px 0px #000, 2px 2px 0px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.8)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.8)' : 'rgba(236, 72, 153, 0.8)'}, 3px 3px 5px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.6)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.6)' : 'rgba(236, 72, 153, 0.6)'}, 0 0 25px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.9)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.9)' : 'rgba(236, 72, 153, 0.9)'}`,
                                        `1px 1px 0px #000, 2px 2px 0px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.3)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(236, 72, 153, 0.3)'}, 3px 3px 5px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.2)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(236, 72, 153, 0.2)'}, 0 0 15px ${stat.color === 'text-yellow-400' ? 'rgba(250, 204, 21, 0.5)' : stat.color === 'text-cyan-400' ? 'rgba(34, 211, 238, 0.5)' : 'rgba(236, 72, 153, 0.5)'}`
                                    ]
                                } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                {stat.value}
                            </motion.div>

                            {/* Digital noise lines */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-px bg-cyan-400 opacity-30"
                                animate={{
                                    scaleX: [0, 1, 0],
                                    opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatDelay: Math.random() * 4 + 2
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="border-t border-gray-700 pt-6 relative">
                    <motion.h3
                        className="text-lg text-yellow-400 mb-4 relative"
                        style={{
                            textShadow: `
                1px 1px 0px #000,
                2px 2px 0px rgba(250, 204, 21, 0.4),
                3px 3px 5px rgba(250, 204, 21, 0.3),
                0 0 15px rgba(250, 204, 21, 0.6)
              `,
                            transform: 'perspective(300px) rotateX(15deg)'
                        }}
                        animate={{
                            textShadow: [
                                '1px 1px 0px #000, 2px 2px 0px rgba(250, 204, 21, 0.4), 3px 3px 5px rgba(250, 204, 21, 0.3), 0 0 15px rgba(250, 204, 21, 0.6)',
                                '1px 1px 0px #000, 2px 2px 0px rgba(250, 204, 21, 0.7), 3px 3px 5px rgba(250, 204, 21, 0.5), 0 0 25px rgba(250, 204, 21, 0.8)',
                                '1px 1px 0px #000, 2px 2px 0px rgba(250, 204, 21, 0.4), 3px 3px 5px rgba(250, 204, 21, 0.3), 0 0 15px rgba(250, 204, 21, 0.6)'
                            ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        BIO
                        {/* Glitch effect */}
                        <motion.span
                            className="absolute inset-0 text-red-500"
                            animate={{
                                opacity: [0, 0.7, 0],
                                x: [0, -1, 1, 0],
                                skewX: [0, -3, 3, 0]
                            }}
                            transition={{
                                duration: 0.1,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 10 + 5
                            }}
                        >
                            BIO
                        </motion.span>
                    </motion.h3>

                    <motion.p
                        className="text-gray-300 leading-relaxed relative"
                        animate={{
                            opacity: [0.9, 1, 0.9]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        Experienced game developer specializing in immersive 3D experiences and cutting-edge
                        interactive technologies. Passionate about creating worlds that blur the line between
                        reality and digital dreams. Expert in Unity, Unreal Engine, and emerging VR/AR platforms.

                        {/* Random text glitch */}
                        <motion.span
                            className="absolute inset-0 text-pink-500 opacity-0"
                            animate={{
                                opacity: [0, 0.3, 0]
                            }}
                            transition={{
                                duration: 0.2,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 15 + 8
                            }}
                        >
                            Experienced game developer specializing in immersive 3D experiences and cutting-edge
                            interactive technologies. Passionate about creating worlds that blur the line between
                            reality and digital dreams. Expert in Unity, Unreal Engine, and emerging VR/AR platforms.
                        </motion.span>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

// Skills Content Component with enhanced effects
const SkillsContent = () => {
    const [activeSkill, setActiveSkill] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomSkill = Math.floor(Math.random() * skillsData.length);
            setActiveSkill(randomSkill);
            setTimeout(() => setActiveSkill(null), 200); // Shorter duration
        }, Math.random() * 8000 + 6000); // Less frequent

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <motion.div
                className="border border-cyan-400/30 bg-black/40 p-6 relative overflow-hidden"
                animate={{
                    borderColor: ['rgba(34, 211, 238, 0.3)', 'rgba(236, 72, 153, 0.4)', 'rgba(34, 211, 238, 0.3)']
                }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                {/* Multiple scan lines */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-px bg-pink-500 opacity-60"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-full h-px bg-yellow-400 opacity-60"
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1 }}
                />

                <motion.h2
                    className="text-2xl text-cyan-400 mb-6 tracking-wider relative cyberpunk-title"
                    style={{
                        textShadow: `
              2px 2px 0px #000,
              4px 4px 0px rgba(34, 211, 238, 0.4),
              6px 6px 10px rgba(34, 211, 238, 0.3),
              0 0 20px rgba(34, 211, 238, 0.6)
            `,
                        transform: 'perspective(400px) rotateX(20deg)'
                    }}
                    animate={{
                        textShadow: [
                            '2px 2px 0px #000, 4px 4px 0px rgba(34, 211, 238, 0.4), 6px 6px 10px rgba(34, 211, 238, 0.3), 0 0 20px rgba(34, 211, 238, 0.6)',
                            '2px 2px 0px #000, 4px 4px 0px rgba(236, 72, 153, 0.6), 6px 6px 10px rgba(236, 72, 153, 0.4), 0 0 25px rgba(236, 72, 153, 0.8)',
                            '2px 2px 0px #000, 4px 4px 0px rgba(34, 211, 238, 0.4), 6px 6px 10px rgba(34, 211, 238, 0.3), 0 0 20px rgba(34, 211, 238, 0.6)'
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    SKILL MATRIX
                    {/* Multiple glitch layers */}
                    <motion.span
                        className="absolute inset-0 text-pink-500"
                        animate={{
                            opacity: [0, 0.8, 0],
                            x: [0, -3, 3, 0],
                            skewX: [0, -8, 8, 0]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 6 + 3
                        }}
                    >
                        SKILL MATRIX
                    </motion.span>
                    <motion.span
                        className="absolute inset-0 text-yellow-400"
                        animate={{
                            opacity: [0, 0.6, 0],
                            x: [0, 2, -2, 0],
                            skewX: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 0.15,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 8 + 4,
                            delay: 0.1
                        }}
                    >
                        SKILL MATRIX
                    </motion.span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillsData.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            className={`border border-gray-700 bg-black/60 p-4 relative overflow-hidden ${activeSkill === index ? 'border-cyan-400 bg-cyan-400/10' : ''
                                }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                borderColor: activeSkill === index
                                    ? ['rgba(107, 114, 128, 1)', 'rgba(34, 211, 238, 1)', 'rgba(236, 72, 153, 0.8)', 'rgba(107, 114, 128, 1)']
                                    : 'rgba(107, 114, 128, 1)',
                                scale: activeSkill === index ? [1, 1.02, 1] : 1
                            }}
                            transition={{
                                delay: index * 0.1,
                                borderColor: { duration: 0.5 },
                                scale: { duration: 0.3 }
                            }}
                        >
                            {/* Intensive flickering background */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-pink-500/10"
                                animate={{
                                    opacity: activeSkill === index ? [0, 0.5, 0.2, 0.7, 0] : 0
                                }}
                                transition={{ duration: 0.4 }}
                            />

                            {/* Digital noise overlay */}
                            <motion.div
                                className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"
                                animate={{
                                    opacity: activeSkill === index ? [0.05, 0.2, 0.05] : 0.05
                                }}
                                transition={{ duration: 0.3 }}
                            />

                            <div className="flex justify-between items-center mb-2 relative z-10">
                                <motion.span
                                    className="text-white font-medium relative"
                                    style={{
                                        textShadow: activeSkill === index
                                            ? '1px 1px 0px #000, 0 0 10px rgba(34, 211, 238, 0.6)'
                                            : '1px 1px 0px #000'
                                    }}
                                    animate={activeSkill === index ? {
                                        textShadow: [
                                            '1px 1px 0px #000, 0 0 10px rgba(34, 211, 238, 0.6)',
                                            '1px 1px 0px #000, 0 0 20px rgba(236, 72, 153, 0.8)',
                                            '1px 1px 0px #000, 0 0 10px rgba(34, 211, 238, 0.6)'
                                        ]
                                    } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    {skill.name}
                                    {/* Text glitch effect */}
                                    {activeSkill === index && (
                                        <motion.span
                                            className="absolute inset-0 text-pink-500"
                                            animate={{
                                                opacity: [0, 0.8, 0],
                                                x: [0, -1, 1, 0],
                                                skewX: [0, -3, 3, 0]
                                            }}
                                            transition={{
                                                duration: 0.1,
                                                repeat: 3,
                                                repeatDelay: 0.1
                                            }}
                                        >
                                            {skill.name}
                                        </motion.span>
                                    )}
                                </motion.span>

                                <motion.span
                                    className={`text-xs border px-2 py-1 relative ${activeSkill === index
                                        ? 'text-cyan-400 border-cyan-400'
                                        : 'text-gray-400 border-gray-600'
                                        }`}
                                    animate={activeSkill === index ? {
                                        borderColor: ['rgba(34, 211, 238, 1)', 'rgba(236, 72, 153, 1)', 'rgba(34, 211, 238, 1)'],
                                        color: ['rgba(34, 211, 238, 1)', 'rgba(236, 72, 153, 1)', 'rgba(34, 211, 238, 1)']
                                    } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    {skill.category}
                                </motion.span>
                            </div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="flex-1 h-2 bg-gray-800 relative overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 relative"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.level}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                    >
                                        {/* Animated progress bar glow */}
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            animate={activeSkill === index ? {
                                                opacity: [0, 0.5, 0],
                                                scaleX: [1, 1.1, 1]
                                            } : {}}
                                            transition={{ duration: 0.4 }}
                                        />
                                    </motion.div>

                                    {/* Progress bar scan line */}
                                    <motion.div
                                        className="absolute top-0 left-0 w-1 h-full bg-white opacity-70"
                                        animate={{
                                            x: [0, skill.level * 3, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: index * 0.3
                                        }}
                                    />
                                </div>

                                <motion.span
                                    className="text-cyan-400 text-sm font-mono relative"
                                    style={{
                                        textShadow: activeSkill === index
                                            ? '0 0 10px rgba(34, 211, 238, 0.8)'
                                            : '0 0 5px rgba(34, 211, 238, 0.3)'
                                    }}
                                    animate={activeSkill === index ? {
                                        scale: [1, 1.1, 1],
                                        textShadow: [
                                            '0 0 10px rgba(34, 211, 238, 0.8)',
                                            '0 0 20px rgba(236, 72, 153, 1)',
                                            '0 0 10px rgba(34, 211, 238, 0.8)'
                                        ]
                                    } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    {skill.level}%
                                </motion.span>
                            </div>

                            {/* Random digital artifacts */}
                            <motion.div
                                className="absolute top-2 right-2 w-1 h-4 bg-cyan-400 opacity-40"
                                animate={{
                                    opacity: [0.4, 1, 0.4],
                                    scaleY: [1, 0.5, 1]
                                }}
                                transition={{
                                    duration: 0.3,
                                    repeat: Infinity,
                                    repeatDelay: Math.random() * 3 + 1
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

// Projects Content Component with enhanced effects
const ProjectsContent = () => {
    const [glitchProject, setGlitchProject] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomProject = Math.floor(Math.random() * projectsData.length);
            setGlitchProject(randomProject);
            setTimeout(() => setGlitchProject(null), 250); // Shorter duration
        }, Math.random() * 10000 + 8000); // Much less frequent

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <motion.div
                className="border border-cyan-400/30 bg-black/40 p-6 relative overflow-hidden"
                animate={{
                    borderColor: [
                        'rgba(34, 211, 238, 0.3)',
                        'rgba(250, 204, 21, 0.4)',
                        'rgba(236, 72, 153, 0.4)',
                        'rgba(34, 211, 238, 0.3)'
                    ]
                }}
                transition={{ duration: 6, repeat: Infinity }}
            >
                {/* Diagonal scan lines */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-px bg-yellow-400 opacity-50 transform rotate-45 origin-left"
                    animate={{
                        scaleX: [0, 2, 0],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <motion.h2
                    className="text-2xl text-cyan-400 mb-6 tracking-wider relative cyberpunk-title"
                    style={{
                        textShadow: `
              2px 2px 0px #000,
              4px 4px 0px rgba(34, 211, 238, 0.4),
              6px 6px 10px rgba(34, 211, 238, 0.3),
              0 0 20px rgba(34, 211, 238, 0.6)
            `,
                        transform: 'perspective(400px) rotateX(20deg)'
                    }}
                    animate={{
                        textShadow: [
                            '2px 2px 0px #000, 4px 4px 0px rgba(34, 211, 238, 0.4), 6px 6px 10px rgba(34, 211, 238, 0.3), 0 0 20px rgba(34, 211, 238, 0.6)',
                            '2px 2px 0px #000, 4px 4px 0px rgba(250, 204, 21, 0.6), 6px 6px 10px rgba(250, 204, 21, 0.4), 0 0 25px rgba(250, 204, 21, 0.8)',
                            '2px 2px 0px #000, 4px 4px 0px rgba(34, 211, 238, 0.4), 6px 6px 10px rgba(34, 211, 238, 0.3), 0 0 20px rgba(34, 211, 238, 0.6)'
                        ]
                    }}
                    transition={{ duration: 4.5, repeat: Infinity }}
                >
                    PROJECT DATABASE
                    {/* Intense glitch effects */}
                    <motion.span
                        className="absolute inset-0 text-red-500"
                        animate={{
                            opacity: [0, 0.9, 0],
                            x: [0, -4, 4, 0],
                            skewX: [0, -10, 10, 0],
                            scaleX: [1, 0.95, 1.05, 1]
                        }}
                        transition={{
                            duration: 0.25,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 5 + 2
                        }}
                    >
                        PROJECT DATABASE
                    </motion.span>
                    <motion.span
                        className="absolute inset-0 text-yellow-400"
                        animate={{
                            opacity: [0, 0.7, 0],
                            x: [0, 3, -3, 0],
                            skewX: [0, 8, -8, 0]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 7 + 3,
                            delay: 0.1
                        }}
                    >
                        PROJECT DATABASE
                    </motion.span>
                </motion.h2>

                <div className="space-y-6">
                    {projectsData.map((project, index) => (
                        <motion.div
                            key={project.name}
                            className={`border border-gray-700 bg-black/60 p-6 relative overflow-hidden ${glitchProject === index ? 'border-pink-500 bg-pink-500/5' : ''
                                }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                borderColor: glitchProject === index
                                    ? ['rgba(107, 114, 128, 1)', 'rgba(236, 72, 153, 1)', 'rgba(250, 204, 21, 0.8)', 'rgba(107, 114, 128, 1)']
                                    : 'rgba(107, 114, 128, 1)',
                                scale: glitchProject === index ? [1, 1.01, 0.99, 1] : 1
                            }}
                            transition={{
                                delay: index * 0.1,
                                borderColor: { duration: 0.6 },
                                scale: { duration: 0.4 }
                            }}
                        >
                            {/* Intense background flicker */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-cyan-400/5 to-yellow-400/10"
                                animate={{
                                    opacity: glitchProject === index ? [0, 0.3, 0.1, 0.5, 0] : 0
                                }}
                                transition={{ duration: 0.5 }}
                            />

                            {/* Multiple scan lines */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-px bg-cyan-400 opacity-60"
                                animate={{
                                    scaleX: glitchProject === index ? [1, 3, 1] : [0, 1, 0],
                                    opacity: glitchProject === index ? [0.6, 1, 0.6] : [0.6, 0.8, 0.6]
                                }}
                                transition={{
                                    duration: glitchProject === index ? 0.3 : 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <motion.h3
                                    className="text-xl text-white font-bold relative"
                                    style={{
                                        textShadow: glitchProject === index
                                            ? '2px 2px 0px #000, 0 0 15px rgba(236, 72, 153, 0.8)'
                                            : '1px 1px 0px #000',
                                        transform: 'perspective(300px) rotateX(10deg)'
                                    }}
                                    animate={glitchProject === index ? {
                                        textShadow: [
                                            '2px 2px 0px #000, 0 0 15px rgba(236, 72, 153, 0.8)',
                                            '2px 2px 0px #000, 0 0 25px rgba(34, 211, 238, 1)',
                                            '2px 2px 0px #000, 0 0 15px rgba(236, 72, 153, 0.8)'
                                        ]
                                    } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    {project.name}
                                    {/* Multiple glitch layers */}
                                    {glitchProject === index && (
                                        <>
                                            <motion.span
                                                className="absolute inset-0 text-pink-500"
                                                animate={{
                                                    opacity: [0, 0.9, 0],
                                                    x: [0, -2, 2, 0],
                                                    skewX: [0, -5, 5, 0]
                                                }}
                                                transition={{
                                                    duration: 0.1,
                                                    repeat: 4,
                                                    repeatDelay: 0.05
                                                }}
                                            >
                                                {project.name}
                                            </motion.span>
                                            <motion.span
                                                className="absolute inset-0 text-cyan-400"
                                                animate={{
                                                    opacity: [0, 0.7, 0],
                                                    x: [0, 1, -1, 0],
                                                    skewX: [0, 3, -3, 0]
                                                }}
                                                transition={{
                                                    duration: 0.08,
                                                    repeat: 3,
                                                    repeatDelay: 0.1,
                                                    delay: 0.05
                                                }}
                                            >
                                                {project.name}
                                            </motion.span>
                                        </>
                                    )}
                                </motion.h3>

                                <motion.span
                                    className={`text-xs px-3 py-1 border relative ${project.status === 'COMPLETED' ? 'border-green-500 text-green-400' :
                                        project.status === 'IN DEVELOPMENT' ? 'border-yellow-500 text-yellow-400' :
                                            'border-blue-500 text-blue-400'
                                        }`}
                                    animate={glitchProject === index ? {
                                        scale: [1, 1.1, 0.9, 1],
                                        opacity: [1, 0.7, 1]
                                    } : {}}
                                    transition={{ duration: 0.4 }}
                                    style={{
                                        boxShadow: glitchProject === index
                                            ? `0 0 10px ${project.status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.6)' :
                                                project.status === 'IN DEVELOPMENT' ? 'rgba(234, 179, 8, 0.6)' :
                                                    'rgba(59, 130, 246, 0.6)'
                                            }`
                                            : 'none'
                                    }}
                                >
                                    {project.status}
                                </motion.span>
                            </div>

                            <motion.p
                                className="text-gray-300 mb-4 relative z-10"
                                animate={glitchProject === index ? {
                                    opacity: [1, 0.8, 1]
                                } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                {project.description}
                                {/* Text corruption effect */}
                                {glitchProject === index && (
                                    <motion.span
                                        className="absolute inset-0 text-pink-500 opacity-0"
                                        animate={{
                                            opacity: [0, 0.4, 0]
                                        }}
                                        transition={{
                                            duration: 0.15,
                                            repeat: 2,
                                            repeatDelay: 0.1
                                        }}
                                    >
                                        {project.description}
                                    </motion.span>
                                )}
                            </motion.p>

                            <div className="flex flex-wrap gap-2 relative z-10">
                                {project.tech.map((tech, techIndex) => (
                                    <motion.span
                                        key={techIndex}
                                        className="text-xs border border-pink-500 text-pink-400 px-2 py-1 relative"
                                        animate={glitchProject === index ? {
                                            borderColor: [
                                                'rgba(236, 72, 153, 1)',
                                                'rgba(34, 211, 238, 1)',
                                                'rgba(250, 204, 21, 1)',
                                                'rgba(236, 72, 153, 1)'
                                            ],
                                            color: [
                                                'rgba(236, 72, 153, 1)',
                                                'rgba(34, 211, 238, 1)',
                                                'rgba(250, 204, 21, 1)',
                                                'rgba(236, 72, 153, 1)'
                                            ]
                                        } : {}}
                                        transition={{
                                            duration: 0.6,
                                            delay: techIndex * 0.1
                                        }}
                                        style={{
                                            boxShadow: glitchProject === index
                                                ? '0 0 8px rgba(236, 72, 153, 0.5)'
                                                : 'none'
                                        }}
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Digital artifacts */}
                            <motion.div
                                className="absolute bottom-2 right-2 w-2 h-6 bg-yellow-400 opacity-30"
                                animate={{
                                    opacity: [0.3, 0.8, 0.3],
                                    scaleY: [1, 0.3, 1]
                                }}
                                transition={{
                                    duration: 0.4,
                                    repeat: Infinity,
                                    repeatDelay: Math.random() * 2 + 1
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

// Contact Content Component
const ContactContent = () => (
    <div className="space-y-8">
        <div className="border border-cyan-400/30 bg-black/40 p-6">
            <h2 className="text-2xl text-cyan-400 mb-6 tracking-wider cyberpunk-title">CONTACT PROTOCOLS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.a
                    href="mailto:muhammadbasil@example.com"
                    className="border border-gray-700 bg-black/60 p-6 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="text-cyan-400 text-lg mb-2 group-hover:text-cyan-300">EMAIL</div>
                    <div className="text-gray-400 text-sm">muhammadbasil@example.com</div>
                </motion.a>

                <motion.a
                    href="https://www.linkedin.com/in/muhammed-basil-cp-cse007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-700 bg-black/60 p-6 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="text-cyan-400 text-lg mb-2 group-hover:text-cyan-300">LINKEDIN</div>
                    <div className="text-gray-400 text-sm">Professional Network</div>
                </motion.a>

                <motion.a
                    href="https://github.com/muhammadbasil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-700 bg-black/60 p-6 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="text-cyan-400 text-lg mb-2 group-hover:text-cyan-300">GITHUB</div>
                    <div className="text-gray-400 text-sm">Code Repository</div>
                </motion.a>

                <motion.div
                    className="border border-gray-700 bg-black/60 p-6"
                >
                    <div className="text-yellow-400 text-lg mb-2">STATUS</div>
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-green-400 text-sm">AVAILABLE FOR HIRE</span>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
);