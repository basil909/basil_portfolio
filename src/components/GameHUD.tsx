'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from './GameContext';

export default function GameHUD() {
  const { gameMode, score, level, experience } = useGame();
  const [showDetails, setShowDetails] = useState(false);
  
  if (!gameMode) return null;
  
  const expNeeded = level * 100;
  const expPercentage = (experience / expNeeded) * 100;
  
  return (
    <motion.div 
      className="fixed top-4 left-4 z-50"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-indigo-200 dark:border-indigo-800"
        whileHover={{ scale: showDetails ? 1 : 1.05 }}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            {level}
          </div>
          <div>
            <div className="text-sm font-medium">Level {level}</div>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
              <div 
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${expPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="ml-2">
            <div className="text-sm font-medium">Score</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{score}</div>
          </div>
        </div>
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between mb-1">
                  <span>Experience:</span>
                  <span>{experience} / {expNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next level:</span>
                  <span>{expNeeded - experience} XP needed</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}