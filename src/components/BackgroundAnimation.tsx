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
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
            {/* Gradient Orbs - Very subtle for professional look */}
            <motion.div
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
                style={{ willChange: 'transform' }}
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
                style={{ willChange: 'transform' }}
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Floating Shapes - Subtle and professional */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute border border-blue-200/10 dark:border-white/5 rounded-lg backdrop-blur-sm"
                    style={{
                        width: Math.random() * 100 + 50,
                        height: Math.random() * 100 + 50,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        willChange: 'transform'
                    }}
                    animate={{
                        y: [0, -50, 0],
                        rotate: [0, 90, 180],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{
                        duration: Math.random() * 15 + 15,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    );
}
