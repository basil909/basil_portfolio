'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from './GameContext';

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const emojis = ['🚀', '🌟', '🎮', '🎨', '🔥', '🎯', '🎪', '🎭', '🎲', '🎸', '🎧', '🎬'];

export default function MemoryGame() {
  const { addPoints, addExperience, unlockAchievement } = useGame();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [timer, setTimer] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [theme, setTheme] = useState<'emoji' | 'tech' | 'nature'>('emoji');

  // Different card themes
  const themes = {
    emoji: ['🚀', '🌟', '🎮', '🎨', '🔥', '🎯', '🎪', '🎭', '🎲', '🎸', '🎧', '🎬'],
    tech: ['💻', '📱', '⌚', '🖥️', '🖨️', '📷', '🎮', '🎧', '📟', '🔋', '💾', '📡'],
    nature: ['🌳', '🌵', '🌺', '🌸', '🍄', '🦋', '🐝', '🐢', '🦔', '🦊', '🦜', '🐙']
  };

  // Initialize game
  const initializeGame = () => {
    // Determine number of pairs based on difficulty
    const numPairs = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 12;
    
    // Select theme
    const selectedEmojis = themes[theme].slice(0, numPairs);
    
    // Create pairs of cards
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle cards
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setGameStarted(true);
    setGameCompleted(false);
    setHintsUsed(0);
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore if already flipped or matched
    if (flippedCards.length >= 2 || cards[id].flipped || cards[id].matched) return;
    
    // Flip the card
    setCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, flipped: true } : card
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, id]);
    
    // Play flip sound
    try {
      const audio = new Audio('/flip.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore errors
    }
  };

  // Show hint
  const showCardHint = () => {
    if (hintsUsed >= 3 || flippedCards.length > 0) return;
    
    // Find unmatched cards
    const unmatchedCards = cards.filter(card => !card.matched);
    if (unmatchedCards.length <= 0) return;
    
    // Randomly select a pair
    const availablePairs: Record<string, number[]> = {};
    unmatchedCards.forEach(card => {
      if (!availablePairs[card.emoji]) {
        availablePairs[card.emoji] = [];
      }
      availablePairs[card.emoji].push(card.id);
    });
    
    // Filter to only pairs with 2 cards
    const validPairs = Object.values(availablePairs).filter(pair => pair.length === 2);
    if (validPairs.length === 0) return;
    
    // Select a random pair
    const selectedPair = validPairs[Math.floor(Math.random() * validPairs.length)];
    
    // Show hint
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
    
    // Temporarily flip the cards
    setCards(prev => 
      prev.map(card => 
        selectedPair.includes(card.id) ? { ...card, flipped: true } : card
      )
    );
    
    // Hide the cards after a short delay
    setTimeout(() => {
      setCards(prev => 
        prev.map(card => 
          selectedPair.includes(card.id) && !card.matched ? { ...card, flipped: false } : card
        )
      );
      setShowHint(false);
    }, 1000);
  };

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      
      // Increment moves
      setMoves(prev => prev + 1);
      
      // Check if cards match
      if (cards[first].emoji === cards[second].emoji) {
        // Mark as matched
        setCards(prev => 
          prev.map(card => 
            card.id === first || card.id === second
              ? { ...card, matched: true }
              : card
          )
        );
        
        // Increment matched pairs
        setMatchedPairs(prev => prev + 1);
        
        // Clear flipped cards
        setFlippedCards([]);
        
        // Play match sound
        try {
          const audio = new Audio('/match.mp3');
          audio.volume = 0.2;
          audio.play().catch(() => {});
        } catch (e) {
          // Ignore errors
        }
      } else {
        // Flip cards back after delay
        setTimeout(() => {
          setCards(prev => 
            prev.map(card => 
              card.id === first || card.id === second
                ? { ...card, flipped: false }
                : card
            )
          );
          
          // Clear flipped cards
          setFlippedCards([]);
        }, 1000);
        
        // Play no match sound
        try {
          const audio = new Audio('/nomatch.mp3');
          audio.volume = 0.2;
          audio.play().catch(() => {});
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    const totalPairs = cards.length / 2;
    if (gameStarted && matchedPairs === totalPairs && totalPairs > 0) {
      setGameCompleted(true);
      setGameStarted(false);
      
      // Calculate score based on difficulty, moves, and time
      const basePoints = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 150;
      const movesPenalty = Math.max(0, moves - totalPairs) * 2;
      const timePenalty = Math.floor(timer / 5);
      const hintPenalty = hintsUsed * 10;
      const finalScore = Math.max(10, basePoints - movesPenalty - timePenalty - hintPenalty);
      
      // Update best score
      const scoreKey = `memory_best_${difficulty}`;
      const savedBestScore = localStorage.getItem(scoreKey);
      const currentBestScore = savedBestScore ? parseInt(savedBestScore) : null;
      
      if (currentBestScore === null || finalScore > currentBestScore) {
        localStorage.setItem(scoreKey, finalScore.toString());
        setBestScore(finalScore);
      }
      
      // Update best time
      const timeKey = `memory_best_time_${difficulty}`;
      const savedBestTime = localStorage.getItem(timeKey);
      const currentBestTime = savedBestTime ? parseInt(savedBestTime) : null;
      
      if (currentBestTime === null || timer < currentBestTime) {
        localStorage.setItem(timeKey, timer.toString());
        setBestTime(timer);
      }
      
      // Add points and experience to global game state
      addPoints(finalScore);
      addExperience(Math.round(finalScore * 0.8));
      
      // Check for achievements
      if (difficulty === 'hard' && moves <= totalPairs * 1.5) {
        unlockAchievement('memory_master');
      }
      
      // Play completion sound
      try {
        const audio = new Audio('/complete.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {
        // Ignore errors
      }
    }
  }, [matchedPairs, cards.length, gameStarted, difficulty, moves, timer, hintsUsed, addPoints, addExperience, unlockAchievement]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted]);

  // Load best score and time
  useEffect(() => {
    // Avoid hydration mismatch by using setTimeout
    if (typeof window === 'undefined') return;
    
    // Use a flag to track if component is mounted
    let isMounted = true;
    
    // Delay loading from localStorage to avoid hydration issues
    const loadTimeout = setTimeout(() => {
      if (!isMounted) return;
      
      const scoreKey = `memory_best_${difficulty}`;
      const timeKey = `memory_best_time_${difficulty}`;
      
      const savedBestScore = localStorage.getItem(scoreKey);
      const savedBestTime = localStorage.getItem(timeKey);
      
      if (savedBestScore && isMounted) {
        setBestScore(parseInt(savedBestScore));
      } else if (isMounted) {
        setBestScore(null);
      }
      
      if (savedBestTime && isMounted) {
        setBestTime(parseInt(savedBestTime));
      } else if (isMounted) {
        setBestTime(null);
      }
    }, 0);
    
    return () => {
      isMounted = false;
      clearTimeout(loadTimeout);
    };
  }, [difficulty]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="MemoryGame bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-indigo-100 dark:border-indigo-900/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Memory Game</h3>
        <div className="flex gap-2">
          {gameStarted && (
            <div className="bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {formatTime(timer)}
              </span>
            </div>
          )}
          {gameStarted && (
            <div className="bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                Moves: {moves}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {!gameStarted && !gameCompleted ? (
        <div className="text-center py-8">
          <h4 className="text-lg font-medium mb-4">Select Difficulty</h4>
          
          <div className="flex justify-center gap-4 mb-6">
            {(['easy', 'medium', 'hard'] as const).map(level => (
              <motion.button
                key={level}
                className={`px-4 py-2 rounded-lg ${
                  difficulty === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </motion.button>
            ))}
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Card Theme</h4>
            <div className="flex justify-center gap-2">
              {(['emoji', 'tech', 'nature'] as const).map(t => (
                <motion.button
                  key={t}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
          
          {bestScore !== null && (
            <div className="mb-2">
              <p className="text-gray-600 dark:text-gray-300">
                Best Score: <span className="font-bold text-indigo-600 dark:text-indigo-400">{bestScore}</span>
              </p>
            </div>
          )}
          
          {bestTime !== null && (
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Best Time: <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatTime(bestTime)}</span>
            </p>
          )}
          
          <motion.button
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initializeGame}
          >
            Start Game
          </motion.button>
        </div>
      ) : gameCompleted ? (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h4 className="text-2xl font-bold mb-2">Congratulations!</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You completed the game in {moves} moves and {formatTime(timer)}
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
              {bestScore !== null && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Best Score</div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">{bestScore}</div>
                </div>
              )}
              
              {bestTime !== null && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Best Time</div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">{formatTime(bestTime)}</div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              <motion.button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeGame}
              >
                Play Again
              </motion.button>
              
              <motion.button
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setGameStarted(false);
                  setGameCompleted(false);
                }}
              >
                Change Settings
              </motion.button>
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {Array.from({ length: 3 - hintsUsed }).map((_, i) => (
                <motion.button
                  key={i}
                  className="bg-indigo-100 dark:bg-indigo-900/30 p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={showCardHint}
                  disabled={showHint || flippedCards.length > 0}
                >
                  💡
                </motion.button>
              ))}
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Pairs: {matchedPairs}/{cards.length / 2}
            </div>
          </div>
          
          <div className={`grid gap-4 ${
            difficulty === 'easy' ? 'grid-cols-3 grid-rows-4' : 
            difficulty === 'medium' ? 'grid-cols-4 grid-rows-4' : 
            'grid-cols-4 grid-rows-6'
          }`}>
            <AnimatePresence>
              {cards.map(card => (
                <motion.div
                  key={card.id}
                  className={`aspect-square rounded-lg cursor-pointer ${
                    card.flipped || card.matched
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } flex items-center justify-center text-2xl sm:text-3xl ${
                    card.matched ? 'bg-green-500' : ''
                  }`}
                  initial={{ rotateY: 0 }}
                  animate={{ 
                    rotateY: card.flipped || card.matched ? 180 : 0,
                    backgroundColor: card.matched ? '#10B981' : undefined
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
                >
                  {(card.flipped || card.matched) && (
                    <motion.div
                      initial={{ rotateY: -180 }}
                      animate={{ rotateY: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {card.emoji}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}