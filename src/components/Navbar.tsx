'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { preloadThemeStyles } from '../utils/themeOptimizer';
import Link from 'next/link';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleScroll = () => {
                setScrolled(window.scrollY > 20);
            };

            // Preload theme styles for instant switching
            preloadThemeStyles();

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' }
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className={`sticky top-0 z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md 
        ${scrolled
                    ? 'bg-white/90 dark:bg-gray-900/90 shadow-md'
                    : 'bg-white/80 dark:bg-gray-900/80'} 
        border-b border-gray-200 dark:border-gray-700 transition-all duration-150`}
        >
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
                <Link href="#" className="flex items-center gap-2">
                    <span className="text-2xl">👨‍💻</span>
                    Basil's Portfolio
                </Link>
            </motion.h1>

            <div className="flex items-center gap-6">
                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-6 items-center">
                    {navLinks.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.href}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (index + 1) }}
                            className="relative hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                        </motion.a>
                    ))}
                    
                    {/* Game Dev Mode Link */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (navLinks.length + 1) }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link 
                            href="/game-dev" 
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all"
                        >
                            <span>🎮</span>
                            <span>Game Dev Mode</span>
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Dark Mode Toggle */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {isDark ? (
                        <motion.span
                            key="moon"
                            initial={{ rotate: -90, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
                        >
                            🌙
                        </motion.span>
                    ) : (
                        <motion.span
                            key="sun"
                            initial={{ rotate: 90, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
                        >
                            ☀️
                        </motion.span>
                    )}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    <div className="flex flex-col py-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link
                            href="/game-dev"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium flex items-center gap-2"
                        >
                            <span>🎮</span>
                            <span>Game Dev Mode</span>
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}