'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from './GameContext';

export default function GameCursor() {
  const { gameMode } = useGame();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafId = useRef<number | null>(null);

  // Mouse tracking with RAF for smooth movement
  useEffect(() => {
    if (!gameMode) {
      setIsVisible(false);
      return;
    }
    
    let isMounted = true;

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMounted) return;
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        if (isMounted) {
          setPosition({ x: e.clientX, y: e.clientY });
          setIsVisible(true);
        }
      });
    };

    // Handle mouse down/up
    const handleMouseDown = () => {
      if (isMounted) setIsClicking(true);
    };
    
    const handleMouseUp = () => {
      if (isMounted) setIsClicking(false);
    };

    // Handle mouse leaving/entering the window
    const handleMouseLeave = () => {
      if (isMounted) setIsVisible(false);
    };
    
    const handleMouseEnter = () => {
      if (isMounted) setIsVisible(true);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    // Show cursor immediately if mouse is already in the window
    setIsVisible(true);

    // Clean up
    return () => {
      isMounted = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [gameMode]);

  // Don't render anything if game mode is off or cursor is not visible
  if (!gameMode || !isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      style={{
        left: position.x - 16,
        top: position.y - 16,
        willChange: 'transform'
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isClicking ? 0.8 : 1 
      }}
      transition={{ 
        opacity: { duration: 0.1 },
        scale: { duration: 0.1 }
      }}
    >
      <div className="relative flex items-center justify-center w-8 h-8">
        {/* Outer ring */}
        <div className="absolute rounded-full border-2 border-indigo-500 w-8 h-8 opacity-70" />
        {/* Inner dot */}
        <div className="absolute rounded-full bg-indigo-600 w-2 h-2" />
        {/* Glow effect */}
        <div className="absolute rounded-full bg-indigo-400 w-4 h-4 opacity-20 animate-pulse" />
      </div>
    </motion.div>
  );
}