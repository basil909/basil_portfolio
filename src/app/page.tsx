'use client';

import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { GameProvider, useGame } from '../components/GameContext';

// Dynamically import game components with loading optimization
const GameCursor = dynamic(() => import('../components/GameCursor'), {
  ssr: false,
  loading: () => null
});

const FloatingElements = dynamic(() => import('../components/FloatingElements'), {
  ssr: false,
  loading: () => null
});

const AchievementsPanel = dynamic(() => import('../components/AchievementsPanel'), {
  ssr: false,
  loading: () => null
});

const GameHUD = dynamic(() => import('../components/GameHUD'), {
  ssr: false,
  loading: () => null
});

const SoundEffects = dynamic(() => import('../components/SoundEffects'), {
  ssr: false,
  loading: () => null
});

// Lazy load game components with higher priority
const HeroGame = dynamic(() => import('../components/HeroGame'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden mt-8 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center">
      <div className="animate-pulse text-indigo-600 dark:text-indigo-400">Loading game...</div>
    </div>
  )
});

// Lower priority game components
const SkillTree = dynamic(() => import('../components/SkillTree'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden mt-8 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center">
      <div className="animate-pulse text-indigo-600 dark:text-indigo-400">Loading skill tree...</div>
    </div>
  )
});

const MemoryGame = dynamic(() => import('../components/MemoryGame'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden mt-8 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center">
      <div className="animate-pulse text-indigo-600 dark:text-indigo-400">Loading memory game...</div>
    </div>
  )
});

const PhysicsPuzzle = dynamic(() => import('../components/PhysicsPuzzle'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden mt-8 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center">
      <div className="animate-pulse text-indigo-600 dark:text-indigo-400">Loading physics puzzle...</div>
    </div>
  )
});

// Memoized welcome message component
const WelcomeMessage = memo(({ show, onClose }: { show: boolean; onClose: () => void }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-20 right-4 bg-indigo-600 text-white p-4 rounded-lg shadow-lg max-w-xs z-50"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <button
          className="absolute top-2 right-2 text-white/70 hover:text-white"
          onClick={onClose}
          aria-label="Close welcome message"
        >
          ✕
        </button>
        <p className="mb-2 font-medium">Try Fun Mode! 🎮</p>
        <p className="text-sm text-white/80">
          Click the button below to enable interactive games and fun elements throughout the portfolio!
        </p>
      </motion.div>
    </AnimatePresence>
  );
});

WelcomeMessage.displayName = 'WelcomeMessage';

// Memoized game mode toggle button
const GameModeToggle = memo(() => {
  const { gameMode, toggleGameMode } = useGame();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome message after a short delay
    const welcomeTimeout = setTimeout(() => {
      setShowWelcome(true);
    }, 3000);

    // Hide welcome message after some time
    const hideWelcomeTimeout = setTimeout(() => {
      setShowWelcome(false);
    }, 10000);

    return () => {
      clearTimeout(welcomeTimeout);
      clearTimeout(hideWelcomeTimeout);
    };
  }, []);

  const handleToggle = useCallback(() => {
    toggleGameMode();

    // Play toggle sound
    if (typeof window !== 'undefined' && window.playSound) {
      window.playSound(gameMode ? 'pop' : 'unlock', 0.2);
    }
  }, [gameMode, toggleGameMode]);

  return (
    <>
      <WelcomeMessage
        show={showWelcome && !gameMode}
        onClose={() => setShowWelcome(false)}
      />

      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          onClick={handleToggle}
          className="bg-indigo-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          title={gameMode ? "Switch to Professional Mode" : "Switch to Fun Mode"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {gameMode ? (
            <>
              <span className="text-sm font-medium hidden sm:inline">Professional Mode</span>
              <span>💼</span>
            </>
          ) : (
            <>
              <span className="text-sm font-medium hidden sm:inline">Fun Mode</span>
              <span>🎮</span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
});

GameModeToggle.displayName = 'GameModeToggle';

// Memoized game section component
const GameSection = memo(({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto px-4 mt-10 mb-20">
    {children}
  </div>
));

GameSection.displayName = 'GameSection';

// Main content component with optimization
function PageContent() {
  const { gameMode } = useGame();
  const [mounted, setMounted] = useState(false);

  // Only enable game elements after component mounts to avoid hydration issues
  useEffect(() => {
    setMounted(true);

    // Add game-mode class to html element when game mode is enabled
    if (gameMode) {
      document.documentElement.classList.add('game-mode');
    } else {
      document.documentElement.classList.remove('game-mode');
    }

    return () => {
      document.documentElement.classList.remove('game-mode');
    };
  }, [gameMode]);

  // Prefetch game components when in game mode
  useEffect(() => {
    if (mounted && gameMode) {
      // Preload high priority components first
      const preloadHighPriority = async () => {
        await Promise.all([
          import('../components/SoundEffects'),
          import('../components/GameHUD'),
          import('../components/HeroGame')
        ]);

        // Then load lower priority components
        setTimeout(() => {
          Promise.all([
            import('../components/GameCursor'),
            import('../components/FloatingElements'),
            import('../components/AchievementsPanel'),
            import('../components/SkillTree'),
            import('../components/MemoryGame')
          ]).catch(() => {
            // Silently handle any loading errors
          });
        }, 1000);
      };

      preloadHighPriority().catch(() => {
        // Silently handle any loading errors
      });
    }
  }, [mounted, gameMode]);

  // Memoize game elements to prevent unnecessary re-renders
  const gameElements = useMemo(() => {
    if (!mounted || !gameMode) return null;

    return (
      <>
        <SoundEffects />
        <GameCursor />
        <FloatingElements />
        <AchievementsPanel />
        <GameHUD />
      </>
    );
  }, [mounted, gameMode]);

  return (
    <div className="min-h-screen">
      <GameModeToggle />

      {/* Game-like elements - only shown when mounted and game mode is enabled */}
      {gameElements}

      {/* Main content */}
      <Navbar />
      <Hero />

      {/* Fun game in hero section - only shown when game mode is enabled */}
      {gameMode && mounted && (
        <GameSection>
          <HeroGame />
        </GameSection>
      )}

      <About />

      {/* Skill tree in about section - only shown when game mode is enabled */}
      {gameMode && mounted && (
        <GameSection>
          <SkillTree />
        </GameSection>
      )}

      <Projects />

      {/* Memory game in projects section - only shown when game mode is enabled */}
      {gameMode && mounted && (
        <GameSection>
          <MemoryGame />
        </GameSection>
      )}

      {/* Physics puzzle game - only shown when game mode is enabled */}
      {gameMode && mounted && (
        <GameSection>
          <PhysicsPuzzle />
        </GameSection>
      )}

      <Contact />
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <PageContent />
    </GameProvider>
  );
}