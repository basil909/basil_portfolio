'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from './GameContext';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'general' | 'games' | 'exploration';
};

const achievements: Achievement[] = [
  // General achievements
  {
    id: 'visit_home',
    title: 'Welcome!',
    description: 'Visit the portfolio for the first time',
    icon: '🏠',
    points: 10,
    category: 'general'
  },
  {
    id: 'visit_all',
    title: 'Explorer',
    description: 'Visit all sections of the portfolio',
    icon: '🧭',
    points: 25,
    category: 'exploration'
  },
  {
    id: 'toggle_theme',
    title: 'Dark Side',
    description: 'Toggle between light and dark mode',
    icon: '🌓',
    points: 15,
    category: 'general'
  },
  {
    id: 'click_social',
    title: 'Social Butterfly',
    description: 'Check out social links',
    icon: '🦋',
    points: 20,
    category: 'exploration'
  },
  // Game achievements
  {
    id: 'reaction_master',
    title: 'Reaction Master',
    description: 'Score 50+ points in the reaction game',
    icon: '⚡',
    points: 50,
    category: 'games'
  },
  {
    id: 'combo_15',
    title: 'Combo King',
    description: 'Achieve a 15x combo in the reaction game',
    icon: '🔥',
    points: 30,
    category: 'games'
  },
  {
    id: 'streak_10',
    title: 'Perfect Aim',
    description: 'Hit 10 targets in a row without missing',
    icon: '🎯',
    points: 40,
    category: 'games'
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    description: 'Complete the hard memory game with minimal moves',
    icon: '🧠',
    points: 75,
    category: 'games'
  },
  {
    id: 'physics_master',
    title: 'Physics Genius',
    description: 'Complete a physics puzzle with 3 stars',
    icon: '🧲',
    points: 60,
    category: 'games'
  },
  {
    id: 'puzzle_solver',
    title: 'Puzzle Solver',
    description: 'Complete all physics puzzles',
    icon: '🧩',
    points: 80,
    category: 'games'
  },
  {
    id: 'skill_tree',
    title: 'Skill Collector',
    description: 'Unlock all skills in the skill tree',
    icon: '🌟',
    points: 100,
    category: 'games'
  }
];

export default function AchievementsPanel() {
  const { achievements: unlockedAchievements } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'general' | 'games' | 'exploration'>('all');
  
  const filteredAchievements = achievements.filter(achievement => 
    filter === 'all' || achievement.category === filter
  );
  
  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const progressPercentage = (unlockedCount / totalAchievements) * 100;
  
  return (
    <>
      <motion.button
        className="fixed bottom-4 left-4 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-40"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        🏆
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Achievements</h2>
                  <button
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="ml-4 text-sm font-medium">
                    {unlockedCount}/{totalAchievements}
                  </div>
                </div>
                
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {(['all', 'general', 'games', 'exploration'] as const).map(category => (
                    <button
                      key={category}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        filter === category
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => setFilter(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid gap-4">
                  {filteredAchievements.map(achievement => {
                    const isUnlocked = unlockedAchievements.includes(achievement.id);
                    return (
                      <motion.div
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${
                          isUnlocked
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 opacity-60'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            isUnlocked
                              ? 'bg-indigo-100 dark:bg-indigo-900/30'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            {isUnlocked ? achievement.icon : '?'}
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-bold">{achievement.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {achievement.description}
                            </p>
                          </div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-bold">
                            {achievement.points} pts
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}