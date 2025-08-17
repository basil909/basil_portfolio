'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Game state types
type GameContextType = {
  gameMode: boolean;
  toggleGameMode: () => void;
  score: number;
  addPoints: (points: number) => void;
  level: number;
  experience: number;
  addExperience: (exp: number) => void;
  achievements: string[];
  unlockAchievement: (id: string) => void;
  stats: GameStats;
};

type GameStats = {
  gamesPlayed: number;
  highScores: Record<string, number>;
  totalPlayTime: number;
  lastPlayed: string | null;
};

// Initial game stats
const initialStats: GameStats = {
  gamesPlayed: 0,
  highScores: {},
  totalPlayTime: 0,
  lastPlayed: null
};

// Create context with default undefined value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  SCORE: 'game_score',
  LEVEL: 'game_level',
  EXP: 'game_exp',
  ACHIEVEMENTS: 'game_achievements',
  STATS: 'game_stats',
  GAME_MODE: 'game_mode_enabled'
};

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  // Game state
  const [gameMode, setGameMode] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [stats, setStats] = useState<GameStats>(initialStats);
  
  // Load saved game state
  useEffect(() => {
    // Avoid hydration mismatch by using setTimeout
    if (typeof window === 'undefined') return;
    
    // Use a flag to track if component is mounted
    let isMounted = true;
    
    // Delay loading from localStorage to avoid hydration issues
    const loadTimeout = setTimeout(() => {
      if (!isMounted) return;
      
      try {
        // Load basic game state
        const savedScore = localStorage.getItem(STORAGE_KEYS.SCORE);
        const savedLevel = localStorage.getItem(STORAGE_KEYS.LEVEL);
        const savedExp = localStorage.getItem(STORAGE_KEYS.EXP);
        const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
        const savedGameMode = localStorage.getItem(STORAGE_KEYS.GAME_MODE);
        
        if (savedScore && isMounted) setScore(parseInt(savedScore));
        if (savedLevel && isMounted) setLevel(parseInt(savedLevel));
        if (savedExp && isMounted) setExperience(parseInt(savedExp));
        if (savedAchievements && isMounted) setAchievements(JSON.parse(savedAchievements));
        if (savedGameMode && isMounted) setGameMode(savedGameMode === 'true');
        
        // Load game stats
        const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
        if (savedStats && isMounted) {
          setStats(JSON.parse(savedStats));
        }
      } catch (e) {
        console.error('Error loading game state:', e);
      }
    }, 0);
    
    return () => {
      isMounted = false;
      clearTimeout(loadTimeout);
    };
  }, []);
  
  // Save game state when it changes - debounced to reduce writes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.SCORE, score.toString());
        localStorage.setItem(STORAGE_KEYS.LEVEL, level.toString());
        localStorage.setItem(STORAGE_KEYS.EXP, experience.toString());
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
        localStorage.setItem(STORAGE_KEYS.GAME_MODE, gameMode.toString());
      } catch (e) {
        console.error('Error saving game state:', e);
      }
    }, 500); // Debounce writes to localStorage
    
    return () => clearTimeout(saveTimeout);
  }, [score, level, experience, achievements, stats, gameMode]);
  
  // Level up system
  useEffect(() => {
    const expNeeded = level * 100;
    if (experience >= expNeeded) {
      setLevel(prev => prev + 1);
      setExperience(prev => prev - expNeeded);
      
      // Play level up sound
      if (typeof window !== 'undefined' && window.playSound) {
        window.playSound('levelup', 0.3);
      }
    }
  }, [experience, level]);
  
  // Toggle game mode
  const toggleGameMode = useCallback(() => {
    setGameMode(prev => !prev);
    
    // Play toggle sound
    if (typeof window !== 'undefined' && window.playSound) {
      window.playSound(gameMode ? 'pop' : 'unlock', 0.2);
    }
  }, [gameMode]);
  
  // Add points to score
  const addPoints = useCallback((points: number) => {
    setScore(prev => prev + points);
  }, []);
  
  // Add experience
  const addExperience = useCallback((exp: number) => {
    setExperience(prev => prev + exp);
  }, []);
  
  // Update game stats
  const updateGameStats = useCallback((gameType: string, gameScore: number, playTime: number) => {
    setStats(prev => {
      const newStats = { ...prev };
      
      // Update games played count
      newStats.gamesPlayed = (prev.gamesPlayed || 0) + 1;
      
      // Update high score if needed
      if (!newStats.highScores) newStats.highScores = {};
      if (!newStats.highScores[gameType] || gameScore > newStats.highScores[gameType]) {
        newStats.highScores[gameType] = gameScore;
      }
      
      // Update play time
      newStats.totalPlayTime = (prev.totalPlayTime || 0) + playTime;
      
      // Update last played timestamp
      newStats.lastPlayed = new Date().toISOString();
      
      return newStats;
    });
  }, []);
  
  // Unlock achievement
  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      if (prev.includes(id)) return prev;
      
      // Play achievement sound
      if (typeof window !== 'undefined' && window.playSound) {
        window.playSound('achievement', 0.3);
      }
      
      // Add XP for new achievement
      setTimeout(() => addExperience(50), 0);
      
      return [...prev, id];
    });
  }, [addExperience]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    gameMode,
    toggleGameMode,
    score,
    addPoints,
    level,
    experience,
    addExperience,
    achievements,
    unlockAchievement,
    stats
  }), [
    gameMode, 
    toggleGameMode, 
    score, 
    addPoints, 
    level, 
    experience, 
    addExperience, 
    achievements, 
    unlockAchievement,
    stats
  ]);
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}