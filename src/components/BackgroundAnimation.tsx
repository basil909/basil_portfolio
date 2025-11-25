'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundAnimation() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none bg-white dark:bg-black transition-colors duration-500">
            {/* Animated Gradient Mesh */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                <motion.div
                    className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-400/30 dark:bg-purple-900/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/30 dark:bg-blue-900/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-400/30 dark:bg-pink-900/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05]" />

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 opacity-20 dark:opacity-30 blur-sm"
                    style={{
                        width: Math.random() * 6 + 2,
                        height: Math.random() * 6 + 2,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50 - 25, 0],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    );
}
