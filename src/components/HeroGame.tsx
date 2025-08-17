'use client';

import React, { useState, useEffect, useRef, useCallback, memo, useMemo, useReducer } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useGame } from './GameContext';

// Types
type TargetType = 'normal' | 'bonus' | 'bomb' | 'special';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  hit: boolean;
  points: number;
  speed: number;
  type: TargetType;
  movePattern?: 'static' | 'linear' | 'circular';
  moveData?: {
    direction?: { x: number; y: number };
    radius?: number;
    angle?: number;
    center?: { x: number; y: number };
  };
}

interface ScorePopup {
  id: number;
  x: number;
  y: number;
  points: number;
  color: string;
}

type PowerupType = 'slowmo' | 'multipoint' | 'shield' | 'magnet';

type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GameModeType = 'classic' | 'survival' | 'zen' | 'challenge';

// Game state reducer for more efficient updates
type GameState = {
  score: number;
  gameActive: boolean;
  timeLeft: number;
  targets: Target[];
  gameCompleted: boolean;
  countdown: number;
  scorePopups: ScorePopup[];
  combo: number;
  streak: number;
  level: number;
  lives: number;
  powerups: PowerupType[];
  isPaused: boolean;
  pointsMultiplier: number;
  hasShield: boolean;
  hasMagnet: boolean;
  targetsMissed: number;
  challengeProgress: number;
};

type GameAction =
  | { type: 'START_GAME'; difficulty: GameDifficulty; gameMode: GameModeType }
  | { type: 'SET_COUNTDOWN'; value: number }
  | { type: 'ACTIVATE_GAME' }
  | { type: 'ADD_TARGET'; target: Target }
  | { type: 'REMOVE_TARGET'; id: number; wasMissed?: boolean }
  | { type: 'HIT_TARGET'; id: number; earnedPoints: number; newCombo: number; newStreak: number }
  | { type: 'HIT_BOMB'; shieldActive: boolean }
  | { type: 'ADD_POPUP'; popup: ScorePopup }
  | { type: 'REMOVE_POPUP'; id: number }
  | { type: 'RESET_COMBO' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'END_GAME' }
  | { type: 'ADD_POWERUP'; powerup: PowerupType }
  | { type: 'USE_POWERUP'; powerup: PowerupType }
  | { type: 'DEACTIVATE_POWERUP'; powerup: PowerupType }
  | { type: 'UPDATE_LEVEL'; level: number }
  | { type: 'DECREMENT_TIME' }
  | { type: 'UPDATE_CHALLENGE_PROGRESS'; points: number };

// Constants
const DIFFICULTY_SETTINGS = {
  easy: {
    sizeMultiplier: 1.2,
    timeLimit: 45,
    lives: 5,
    targetDuration: 3000,
    targetFrequency: 800,
    bombProbability: 0.05,
    bonusProbability: 0.15,
    specialProbability: 0.01,
    movingTargetProbability: 0.2
  },
  medium: {
    sizeMultiplier: 1,
    timeLimit: 30,
    lives: 3,
    targetDuration: 2500,
    targetFrequency: 600,
    bombProbability: 0.1,
    bonusProbability: 0.15,
    specialProbability: 0.02,
    movingTargetProbability: 0.4
  },
  hard: {
    sizeMultiplier: 0.8,
    timeLimit: 20,
    lives: 2,
    targetDuration: 2000,
    targetFrequency: 500,
    bombProbability: 0.15,
    bonusProbability: 0.1,
    specialProbability: 0.03,
    movingTargetProbability: 0.6
  },
  expert: {
    sizeMultiplier: 0.7,
    timeLimit: 15,
    lives: 1,
    targetDuration: 1800,
    targetFrequency: 400,
    bombProbability: 0.2,
    bonusProbability: 0.1,
    specialProbability: 0.05,
    movingTargetProbability: 0.8
  }
};

const GAME_MODE_SETTINGS = {
  classic: { useTimeLimit: true, useLives: false },
  survival: { useTimeLimit: false, useLives: true, timeLimit: 90 },
  zen: { useTimeLimit: true, useLives: false, timeLimit: 120 },
  challenge: { useTimeLimit: true, useLives: true, timeLimit: 60 }
};

const POWERUP_SETTINGS = {
  slowmo: { duration: 5000, icon: '⏱️', color: 'bg-blue-500' },
  multipoint: { duration: 8000, icon: '2️⃣', color: 'bg-yellow-500' },
  shield: { duration: 0, icon: '🛡️', color: 'bg-green-500' },
  magnet: { duration: 10000, icon: '🧲', color: 'bg-purple-500' }
};

// Initial game state
const initialGameState: GameState = {
  score: 0,
  gameActive: false,
  timeLeft: 30,
  targets: [],
  gameCompleted: false,
  countdown: 0,
  scorePopups: [],
  combo: 0,
  streak: 0,
  level: 1,
  lives: 3,
  powerups: [],
  isPaused: false,
  pointsMultiplier: 1,
  hasShield: false,
  hasMagnet: false,
  targetsMissed: 0,
  challengeProgress: 0
};

// Game state reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const diffSettings = DIFFICULTY_SETTINGS[action.difficulty];
      const modeSettings = GAME_MODE_SETTINGS[action.gameMode];

      return {
        ...initialGameState,
        countdown: 3,
        timeLeft: modeSettings.useTimeLimit
          ? ('timeLimit' in modeSettings ? modeSettings.timeLimit : diffSettings.timeLimit)
          : diffSettings.timeLimit,
        lives: modeSettings.useLives ? diffSettings.lives : 3
      };
    }

    case 'SET_COUNTDOWN':
      return { ...state, countdown: action.value };

    case 'ACTIVATE_GAME':
      return { ...state, gameActive: true, countdown: 0 };

    case 'ADD_TARGET':
      return { ...state, targets: [...state.targets, action.target] };

    case 'REMOVE_TARGET': {
      const targetIndex = state.targets.findIndex(t => t.id === action.id);
      if (targetIndex === -1) return state;

      const target = state.targets[targetIndex];
      let newState = { ...state, targets: state.targets.filter(t => t.id !== action.id) };

      // If target was missed (not hit) and it's not a bomb
      if (action.wasMissed && target && !target.hit && target.type !== 'bomb') {
        newState = {
          ...newState,
          combo: 0,
          streak: 0,
          targetsMissed: state.targetsMissed + 1
        };
      }

      return newState;
    }

    case 'HIT_TARGET': {
      const targetIndex = state.targets.findIndex(t => t.id === action.id);
      if (targetIndex === -1) return state;

      const updatedTargets = [...state.targets];
      updatedTargets[targetIndex] = { ...updatedTargets[targetIndex], hit: true };

      return {
        ...state,
        targets: updatedTargets,
        score: state.score + action.earnedPoints,
        combo: action.newCombo,
        streak: action.newStreak
      };
    }

    case 'HIT_BOMB': {
      if (action.shieldActive) {
        return { ...state, hasShield: false };
      }

      return {
        ...state,
        score: Math.max(0, state.score - 10),
        combo: 0,
        streak: 0,
        lives: state.lives > 0 ? state.lives - 1 : 0
      };
    }

    case 'ADD_POPUP':
      return { ...state, scorePopups: [...state.scorePopups, action.popup] };

    case 'REMOVE_POPUP':
      return { ...state, scorePopups: state.scorePopups.filter(p => p.id !== action.id) };

    case 'RESET_COMBO':
      return { ...state, combo: 0 };

    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };

    case 'END_GAME':
      return { ...state, gameActive: false, gameCompleted: true };

    case 'ADD_POWERUP':
      return { ...state, powerups: [...state.powerups, action.powerup] };

    case 'USE_POWERUP': {
      const newPowerups = state.powerups.filter(p => p !== action.powerup);
      let newState = { ...state, powerups: newPowerups };

      if (action.powerup === 'shield') {
        newState.hasShield = true;
      } else if (action.powerup === 'multipoint') {
        newState.pointsMultiplier = 2;
      } else if (action.powerup === 'magnet') {
        newState.hasMagnet = true;
      }

      return newState;
    }

    case 'DEACTIVATE_POWERUP': {
      if (action.powerup === 'multipoint') {
        return { ...state, pointsMultiplier: 1 };
      } else if (action.powerup === 'magnet') {
        return { ...state, hasMagnet: false };
      }
      return state;
    }

    case 'UPDATE_LEVEL':
      return { ...state, level: action.level };

    case 'DECREMENT_TIME':
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };

    case 'UPDATE_CHALLENGE_PROGRESS':
      return { ...state, challengeProgress: state.challengeProgress + action.points };

    default:
      return state;
  }
}

// Optimized target component with CSS variables for positioning
const TargetComponent = memo(({ target, onHit }: { target: Target, onHit: (id: number) => void }) => {
  const controls = useAnimation();

  // Set up animations based on target type and state
  useEffect(() => {
    if (target.hit) {
      controls.start({
        scale: [1, 1.5, 0],
        opacity: [1, 0],
        transition: { duration: 0.3 }
      });
    } else {
      controls.start({
        scale: [0, 1.2, 1],
        opacity: 1,
        transition: {
          duration: 0.2,
          type: "spring",
          stiffness: 300,
          damping: 15
        }
      });
    }
  }, [target.hit, controls]);

  // Determine target class based on type and state
  const targetClass = useMemo(() => {
    if (target.hit) {
      if (target.type === 'bomb') return 'bg-red-500 ring-4 ring-red-300 dark:ring-red-700';
      if (target.type === 'bonus') return 'bg-yellow-400 ring-4 ring-yellow-300 dark:ring-yellow-700';
      if (target.type === 'special') return 'bg-purple-500 ring-4 ring-purple-300 dark:ring-purple-700';
      return 'bg-green-500 ring-4 ring-green-300 dark:ring-green-700';
    } else {
      if (target.type === 'bomb') return 'bg-red-500 ring-2 ring-red-300 dark:ring-red-700';
      if (target.type === 'bonus') return 'bg-yellow-400 ring-2 ring-yellow-300 dark:ring-yellow-700';
      if (target.type === 'special') return 'bg-purple-500 ring-2 ring-purple-300 dark:ring-purple-700';
      return 'bg-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700';
    }
  }, [target.hit, target.type]);

  // Use CSS variables for positioning to avoid style recalculation
  const style = {
    '--target-x': `${target.x}%`,
    '--target-y': `${target.y}%`,
    '--target-size': `${target.size}px`,
    left: 'var(--target-x)',
    top: 'var(--target-y)',
    width: 'var(--target-size)',
    height: 'var(--target-size)',
    transform: 'translate(-50%, -50%)'
  } as React.CSSProperties;

  return (
    <motion.div
      className={`absolute rounded-full cursor-pointer shadow-lg ${targetClass}`}
      style={style}
      animate={controls}
      onClick={() => !target.hit && onHit(target.id)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {target.type === 'bomb' && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
          💣
        </div>
      )}
      {target.type === 'bonus' && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
          ⭐
        </div>
      )}
      {target.type === 'special' && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
          🎯
        </div>
      )}
    </motion.div>
  );
});

TargetComponent.displayName = 'TargetComponent';

// Optimized score popup component
const ScorePopupComponent = memo(({ popup }: { popup: ScorePopup }) => {
  return (
    <motion.div
      className={`absolute font-bold text-lg ${popup.color}`}
      style={{
        left: `${popup.x}%`,
        top: `${popup.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 1, y: -30, scale: 1.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {popup.points > 0 ? `+${popup.points}` : popup.points}
    </motion.div>
  );
});

ScorePopupComponent.displayName = 'ScorePopupComponent';

// Optimized powerup component
const PowerupComponent = memo(({ powerup, onUse }: { powerup: PowerupType, onUse: (powerup: PowerupType) => void }) => {
  const settings = POWERUP_SETTINGS[powerup];

  return (
    <motion.button
      className={`${settings.color} text-white p-1 rounded-full w-8 h-8 flex items-center justify-center`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onUse(powerup)}
      aria-label={`Use ${powerup} powerup`}
    >
      {settings.icon}
    </motion.button>
  );
});

PowerupComponent.displayName = 'PowerupComponent';

// Game controls component
const GameControls = memo(({
  difficulty,
  setDifficulty,
  gameMode,
  setGameMode
}: {
  difficulty: GameDifficulty;
  setDifficulty: (d: GameDifficulty) => void;
  gameMode: GameModeType;
  setGameMode: (m: GameModeType) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 w-full max-w-md">
    <div>
      <h4 className="text-sm font-medium mb-2">Difficulty</h4>
      <div className="flex flex-wrap gap-2">
        {(['easy', 'medium', 'hard', 'expert'] as const).map(level => (
          <button
            key={level}
            className={`px-3 py-1 text-xs rounded-full ${difficulty === level
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            onClick={() => setDifficulty(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium mb-2">Game Mode</h4>
      <div className="flex flex-wrap gap-2">
        {(['classic', 'survival', 'zen', 'challenge'] as const).map(mode => (
          <button
            key={mode}
            className={`px-3 py-1 text-xs rounded-full ${gameMode === mode
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            onClick={() => setGameMode(mode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  </div>
));

GameControls.displayName = 'GameControls';

// Game HUD component
const GameHUD = memo(({
  score,
  combo,
  timeLeft,
  lives,
  level,
  gameMode,
  isPaused,
  onPause,
  hasShield,
  pointsMultiplier,
  hasMagnet,
  challengeProgress,
  challengeGoal
}: {
  score: number;
  combo: number;
  timeLeft: number;
  lives: number;
  level: number;
  gameMode: GameModeType;
  isPaused: boolean;
  onPause: () => void;
  hasShield: boolean;
  pointsMultiplier: number;
  hasMagnet: boolean;
  challengeProgress: number;
  challengeGoal: number;
}) => (
  <>
    <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
      <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-bold">
        Score: {score}
      </div>

      <div className="flex items-center gap-2">
        {combo > 1 && (
          <motion.div
            className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-bold text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            key={combo}
          >
            {combo}x Combo!
          </motion.div>
        )}

        {gameMode === 'survival' && (
          <div className="flex items-center gap-1">
            {Array.from({ length: lives }).map((_, i) => (
              <motion.div
                key={i}
                className="text-red-500"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                ❤️
              </motion.div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-bold">
          Time: {timeLeft}s
        </div>

        <button
          className="bg-white dark:bg-gray-700 p-1 rounded-full"
          onClick={onPause}
          aria-label={isPaused ? "Resume game" : "Pause game"}
        >
          {isPaused ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>

    {/* Level indicator */}
    <div className="absolute top-12 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold">
      Level {level}
    </div>

    {/* Active powerups indicators */}
    <div className="absolute top-12 left-16 flex gap-1">
      {hasShield && (
        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span>🛡️</span> Shield
        </div>
      )}

      {pointsMultiplier > 1 && (
        <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span>2️⃣</span> {pointsMultiplier}x
        </div>
      )}

      {hasMagnet && (
        <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span>🧲</span> Magnet
        </div>
      )}
    </div>

    {/* Challenge progress bar */}
    {gameMode === 'challenge' && challengeGoal > 0 && (
      <div className="absolute bottom-2 left-2 right-2">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${Math.min(100, (challengeProgress / challengeGoal) * 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-center mt-1 text-gray-600 dark:text-gray-300">
          {challengeProgress}/{challengeGoal} points
        </div>
      </div>
    )}
  </>
));

GameHUD.displayName = 'GameHUD';

// Main component
export default function HeroGame() {
  // Game context
  const { addPoints, addExperience, unlockAchievement } = useGame();

  // Game settings state
  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [gameMode, setGameMode] = useState<GameModeType>('classic');
  const [highScore, setHighScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [challengeGoal, setChallengeGoal] = useState(100);
  const [challengeLevel, setChallengeLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Game state using reducer for better performance
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  // Refs
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const powerupTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const gameStartTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Load high score based on game mode and difficulty
  useEffect(() => {
    const scoreKey = `reaction_game_high_score_${gameMode}_${difficulty}`;
    const savedHighScore = localStorage.getItem(scoreKey);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    } else {
      setHighScore(0);
    }

    // Load challenge level if in challenge mode
    if (gameMode === 'challenge') {
      const savedLevel = localStorage.getItem('reaction_game_challenge_level');
      if (savedLevel) {
        const level = parseInt(savedLevel);
        setChallengeLevel(level);
        setChallengeGoal(level * 25);
      } else {
        setChallengeLevel(1);
        setChallengeGoal(25);
      }
    }
  }, [gameMode, difficulty]);

  // Play sound effect with Web Audio API if available
  const playSound = useCallback((sound: string, volume = 0.2) => {
    if (typeof window !== 'undefined' && window.playSound) {
      window.playSound(sound, volume);
    }
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    // Clear any existing timeouts and intervals
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
    intervalsRef.current.forEach(id => clearInterval(id));
    intervalsRef.current = [];

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Reset game state
    dispatch({ type: 'START_GAME', difficulty, gameMode });

    // Start countdown
    const countdownTimer = setInterval(() => {
      dispatch({ type: 'SET_COUNTDOWN', value: gameState.countdown - 1 });

      if (gameState.countdown <= 1) {
        clearInterval(countdownTimer);

        // Set game as active after countdown
        dispatch({ type: 'ACTIVATE_GAME' });
        gameStartTimeRef.current = performance.now();
        lastFrameTimeRef.current = performance.now();

        // Start generating targets
        generateTarget();

        // Start animation loop for moving targets
        startAnimationLoop();
      }
    }, 1000);

    intervalsRef.current.push(countdownTimer);

    // Play start sound
    playSound('unlock', 0.3);
  }, [difficulty, gameMode, gameState.countdown, playSound]);

  // Animation loop for moving targets
  const startAnimationLoop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animate = (timestamp: number) => {
      // Skip if game is paused or not active
      if (!gameState.gameActive || gameState.isPaused) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;

      // Only update at ~60fps
      if (deltaTime > 16) {
        lastFrameTimeRef.current = timestamp;

        // Update moving targets
        const updatedTargets = gameState.targets.map(target => {
          if (!target.movePattern || target.movePattern === 'static') {
            return target;
          }

          let newX = target.x;
          let newY = target.y;

          // Apply magnet effect if active
          if (gameState.hasMagnet && target.type !== 'bomb') {
            const centerX = 50;
            const centerY = 50;
            const dx = centerX - newX;
            const dy = centerY - newY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
              newX += (dx / distance) * 0.5;
              newY += (dy / distance) * 0.5;
            }
          }

          // Apply movement patterns
          if (target.movePattern === 'linear' && target.moveData?.direction) {
            const speed = target.speed * (deltaTime / 100);
            newX += target.moveData.direction.x * speed;
            newY += target.moveData.direction.y * speed;

            // Bounce off edges
            if (newX < 5 || newX > 95) {
              if (target.moveData.direction) {
                target.moveData.direction.x *= -1;
              }
              newX = Math.max(5, Math.min(95, newX));
            }

            if (newY < 5 || newY > 95) {
              if (target.moveData.direction) {
                target.moveData.direction.y *= -1;
              }
              newY = Math.max(5, Math.min(95, newY));
            }
          }
          else if (target.movePattern === 'circular' && target.moveData?.radius && target.moveData?.angle !== undefined) {
            const speed = target.speed * (deltaTime / 500);
            const newAngle = (target.moveData.angle + speed) % 360;

            if (!target.moveData.center) {
              target.moveData.center = { x: target.x, y: target.y };
            }

            newX = target.moveData.center.x + Math.cos(newAngle * Math.PI / 180) * target.moveData.radius;
            newY = target.moveData.center.y + Math.sin(newAngle * Math.PI / 180) * target.moveData.radius;

            target.moveData.angle = newAngle;
          }

          return { ...target, x: newX, y: newY };
        });

        // Only update state if targets have changed
        if (JSON.stringify(updatedTargets) !== JSON.stringify(gameState.targets)) {
          // Use a functional update to avoid race conditions
          setTargets(updatedTargets);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameActive, gameState.isPaused, gameState.targets, gameState.hasMagnet]);

  // Direct state setters for performance-critical updates
  const setTargets = useCallback((newTargets: Target[]) => {
    dispatch({ type: 'SET_TARGETS', targets: newTargets } as any);
  }, []);

  // Generate a new target
  const generateTarget = useCallback(() => {
    // Don't generate targets if game is not active or paused
    if (!gameState.gameActive || gameState.isPaused) return;

    const diffSettings = DIFFICULTY_SETTINGS[difficulty];

    // Determine target type based on probability
    const rand = Math.random();
    let type: TargetType;

    if (rand < diffSettings.bombProbability) {
      type = 'bomb';
    } else if (rand < diffSettings.bombProbability + diffSettings.bonusProbability) {
      type = 'bonus';
    } else if (rand < diffSettings.bombProbability + diffSettings.bonusProbability + diffSettings.specialProbability) {
      type = 'special';
    } else {
      type = 'normal';
    }

    // Determine if target should move
    let movePattern: 'static' | 'linear' | 'circular' = 'static';
    let moveData: Target['moveData'] = {};

    if (Math.random() < diffSettings.movingTargetProbability) {
      if (Math.random() < 0.6) {
        movePattern = 'linear';
        const angle = Math.random() * 2 * Math.PI;
        moveData = {
          direction: {
            x: Math.cos(angle),
            y: Math.sin(angle)
          }
        };
      } else {
        movePattern = 'circular';
        moveData = {
          radius: 5 + Math.random() * 15,
          angle: Math.random() * 360
        };
      }
    }

    // Create a new target
    const newTarget: Target = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: (type === 'bonus' ? 15 + Math.random() * 15 :
        type === 'bomb' ? 25 + Math.random() * 15 :
          type === 'special' ? 20 + Math.random() * 10 :
            20 + Math.random() * 25) * diffSettings.sizeMultiplier,
      hit: false,
      points: type === 'bonus' ? 5 : type === 'bomb' ? -10 : type === 'special' ? 10 : 1,
      speed: type === 'bonus' ? 1.5 : type === 'special' ? 2 : 1,
      type,
      movePattern,
      moveData
    };

    // Add the target
    dispatch({ type: 'ADD_TARGET', target: newTarget });

    // Remove target after a delay if not hit
    const targetDuration = type === 'bonus' ?
      diffSettings.targetDuration * 0.6 :
      type === 'special' ?
        diffSettings.targetDuration * 0.5 :
        diffSettings.targetDuration;

    const removeTimeout = setTimeout(() => {
      dispatch({ type: 'REMOVE_TARGET', id: newTarget.id, wasMissed: true });
    }, targetDuration);

    // Generate another target after a delay
    const targetFrequency = diffSettings.targetFrequency / Math.sqrt(gameState.level);
    const nextTargetTimeout = setTimeout(() => {
      if (gameState.gameActive && !gameState.isPaused) {
        generateTarget();
      }
    }, targetFrequency);

    // Store timeouts
    timeoutsRef.current.push(removeTimeout, nextTargetTimeout);
  }, [difficulty, gameState.gameActive, gameState.isPaused, gameState.level]);

  // Handle clicking a target
  const hitTarget = useCallback((id: number) => {
    if (!gameState.gameActive || gameState.isPaused) return;

    // Find the target
    const target = gameState.targets.find(t => t.id === id);
    if (!target || target.hit) return;

    // Handle bomb targets
    if (target.type === 'bomb') {
      // Check if shield is active
      if (gameState.hasShield) {
        dispatch({ type: 'HIT_BOMB', shieldActive: true });
        playSound('shield');
      } else {
        dispatch({ type: 'HIT_BOMB', shieldActive: false });
        playSound('bomb', 0.3);
      }
    } else {
      // Handle regular targets
      const newCombo = gameState.combo + 1;
      const newStreak = gameState.streak + 1;

      // Calculate points with combo multiplier
      const comboMultiplier = Math.min(5, 1 + Math.floor(newCombo / 3) * 0.5);
      const pointsEarned = Math.round(target.points * comboMultiplier * gameState.pointsMultiplier);

      // Update game state
      dispatch({
        type: 'HIT_TARGET',
        id: target.id,
        earnedPoints: pointsEarned,
        newCombo,
        newStreak
      });

      // Add score popup
      const popupId = Date.now();
      dispatch({
        type: 'ADD_POPUP',
        popup: {
          id: popupId,
          x: target.x,
          y: target.y,
          points: pointsEarned,
          color: target.type === 'bonus' ? 'text-yellow-400' :
            target.type === 'special' ? 'text-purple-400' : 'text-white'
        }
      });

      // Update challenge progress
      if (gameMode === 'challenge') {
        dispatch({ type: 'UPDATE_CHALLENGE_PROGRESS', points: pointsEarned });

        // Check if challenge is completed
        if (gameState.challengeProgress + pointsEarned >= challengeGoal) {
          completeChallenge();
        }
      }

      // Check for achievements
      if (newStreak >= 10) {
        unlockAchievement('streak_10');
      }
      if (newCombo >= 15) {
        unlockAchievement('combo_15');
      }
      if (target.type === 'special') {
        unlockAchievement('special_target');
      }

      // Reset combo timer
      if (comboTimerRef.current) {
        clearTimeout(comboTimerRef.current);
      }
      comboTimerRef.current = setTimeout(() => {
        dispatch({ type: 'RESET_COMBO' });
      }, 2000);

      // Remove score popup after animation
      const popupTimeout = setTimeout(() => {
        dispatch({ type: 'REMOVE_POPUP', id: popupId });
      }, 1000);

      // Play sound
      playSound(
        target.type === 'bonus' ? 'bonus' :
          target.type === 'special' ? 'special' : 'pop',
        0.2
      );

      // Random chance to spawn a powerup
      if ((target.type === 'special' || Math.random() < 0.05) && gameState.powerups.length < 3) {
        const availablePowerups: PowerupType[] = ['slowmo', 'multipoint', 'shield', 'magnet'];
        const randomPowerup = availablePowerups[Math.floor(Math.random() * availablePowerups.length)];
        dispatch({ type: 'ADD_POWERUP', powerup: randomPowerup });
      }

      // Store timeouts
      timeoutsRef.current.push(popupTimeout);
    }

    // Remove hit target after animation
    const removeTimeout = setTimeout(() => {
      dispatch({ type: 'REMOVE_TARGET', id });
    }, 300);

    timeoutsRef.current.push(removeTimeout);
  }, [
    gameState.gameActive,
    gameState.isPaused,
    gameState.targets,
    gameState.combo,
    gameState.streak,
    gameState.pointsMultiplier,
    gameState.hasShield,
    gameState.powerups,
    gameState.challengeProgress,
    gameMode,
    challengeGoal,
    playSound,
    unlockAchievement
  ]);

  // Complete a challenge level
  const completeChallenge = useCallback(() => {
    // Save progress
    const nextLevel = challengeLevel + 1;
    localStorage.setItem('reaction_game_challenge_level', nextLevel.toString());

    // Show level up notification
    setShowLevelUp(true);

    // Award bonus points and experience
    addPoints(challengeLevel * 10);
    addExperience(challengeLevel * 20);

    // Play level up sound
    playSound('levelup', 0.3);

    // Hide notification after delay
    setTimeout(() => {
      setShowLevelUp(false);

      // Update challenge settings
      setChallengeLevel(nextLevel);
      setChallengeGoal(nextLevel * 25);

      // Add time for next level
      dispatch({ type: 'ADD_TIME', seconds: 15 } as any);

      // Unlock achievement for completing challenges
      if (nextLevel >= 5) {
        unlockAchievement('challenge_master');
      }
    }, 3000);
  }, [challengeLevel, addPoints, addExperience, playSound, unlockAchievement]);

  // Use powerup
  const usePowerup = useCallback((powerup: PowerupType) => {
    if (!gameState.gameActive || gameState.isPaused) return;

    // Apply powerup
    dispatch({ type: 'USE_POWERUP', powerup });

    // Set up powerup duration
    const settings = POWERUP_SETTINGS[powerup];

    // Clear any existing timer for this powerup
    if (powerupTimersRef.current[powerup]) {
      clearTimeout(powerupTimersRef.current[powerup]);
    }

    // Set timer for powerup duration if it has one
    if (settings.duration > 0) {
      powerupTimersRef.current[powerup] = setTimeout(() => {
        dispatch({ type: 'DEACTIVATE_POWERUP', powerup });
      }, settings.duration);
    }

    // Play powerup sound
    playSound(powerup === 'shield' ? 'shield' :
      powerup === 'slowmo' ? 'slowmo' :
        powerup === 'multipoint' ? 'bonus' : 'special', 0.3);
  }, [gameState.gameActive, gameState.isPaused, playSound]);

  // Toggle pause
  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
    playSound('pop');
  }, [playSound]);

  // End game
  const endGame = useCallback(() => {
    // Update high score if needed
    const scoreKey = `reaction_game_high_score_${gameMode}_${difficulty}`;
    if (gameState.score > highScore) {
      setHighScore(gameState.score);
      localStorage.setItem(scoreKey, gameState.score.toString());
    }

    // Add points and experience to global game state
    addPoints(gameState.score);
    addExperience(Math.round(gameState.score * 1.5));

    // Check for achievements
    if (gameState.score >= 50) {
      unlockAchievement('reaction_master');
    }

    // Calculate accuracy
    const totalAttempts = gameState.targets.length + gameState.targetsMissed;
    const accuracy = totalAttempts > 0 ?
      Math.round((gameState.targets.filter(t => t.hit).length / totalAttempts) * 100) : 0;

    if (accuracy >= 90 && totalAttempts >= 20) {
      unlockAchievement('accuracy_master');
    }

    // Clean up
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
    intervalsRef.current.forEach(id => clearInterval(id));
    intervalsRef.current = [];

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    Object.values(powerupTimersRef.current).forEach(timer => clearTimeout(timer));
    powerupTimersRef.current = {};

    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = null;
    }

    // Set game as completed
    dispatch({ type: 'END_GAME' });

    // Play game over sound
    playSound('complete', 0.3);
  }, [gameMode, difficulty, gameState.score, gameState.targets, gameState.targetsMissed, highScore, addPoints, addExperience, unlockAchievement, playSound]);

  // Game timer
  useEffect(() => {
    if (!gameState.gameActive || gameState.isPaused) return;

    const timer = setInterval(() => {
      dispatch({ type: 'DECREMENT_TIME' });

      if (gameState.timeLeft <= 1) {
        clearInterval(timer);
        endGame();
      }
    }, 1000);

    intervalsRef.current.push(timer);

    return () => {
      clearInterval(timer);
    };
  }, [gameState.gameActive, gameState.isPaused, gameState.timeLeft, endGame]);

  // Level up based on score
  useEffect(() => {
    const newLevel = Math.max(1, Math.floor(gameState.score / 10) + 1);
    if (newLevel > gameState.level) {
      dispatch({ type: 'UPDATE_LEVEL', level: newLevel });
      playSound('levelup', 0.2);
    }
  }, [gameState.score, gameState.level, playSound]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      intervalsRef.current.forEach(id => clearInterval(id));

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      Object.values(powerupTimersRef.current).forEach(timer => clearTimeout(timer));

      if (comboTimerRef.current) {
        clearTimeout(comboTimerRef.current);
      }
    };
  }, []);

  // Render game UI based on state
  return (
    <div className="HeroGame relative w-full h-96 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden mt-8 border-2 border-indigo-100 dark:border-indigo-900/30 shadow-lg" ref={gameContainerRef}>
      {!gameState.gameActive && !gameState.gameCompleted && gameState.countdown === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <h3 className="text-2xl font-bold mb-4">Reaction Master</h3>

          {!showSettings ? (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Click the circles as fast as you can! Build combos for bonus points.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  <span className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>
                    <span className="text-sm">1 point</span>
                  </span>
                  <span className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
                    <span className="text-sm">5 points</span>
                  </span>
                  <span className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    <span className="text-sm">-10 points</span>
                  </span>
                  <span className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                    <span className="text-sm">10 points</span>
                  </span>
                </div>
              </div>

              <GameControls
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                gameMode={gameMode}
                setGameMode={setGameMode}
              />

              <div className="flex gap-4">
                <motion.button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                >
                  Start Game
                </motion.button>

                <motion.button
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(true)}
                >
                  Settings
                </motion.button>

                <motion.button
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTutorial(true)}
                >
                  How to Play
                </motion.button>
              </div>

              {highScore > 0 && (
                <div className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                  High Score: <span className="font-bold text-indigo-600 dark:text-indigo-400">{highScore}</span>
                </div>
              )}

              {gameMode === 'challenge' && challengeLevel > 1 && (
                <div className="mt-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  Challenge Level: <span className="font-bold text-indigo-600 dark:text-indigo-400">{challengeLevel}</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full max-w-md">
              <h4 className="text-lg font-medium mb-4">Game Settings</h4>

              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Visual Theme</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['default', 'neon', 'retro', 'space'] as const).map(theme => (
                    <button
                      key={theme}
                      className="px-3 py-2 text-xs rounded-lg bg-indigo-600 text-white"
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <motion.button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(false)}
                >
                  Back
                </motion.button>
              </div>
            </div>
          )}
        </div>
      ) : gameState.countdown > 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-4">Get Ready!</h3>
          <motion.div
            className="text-6xl font-bold text-indigo-600 dark:text-indigo-400"
            key={gameState.countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {gameState.countdown}
          </motion.div>
        </div>
      ) : gameState.gameCompleted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            Your score: {gameState.score}
          </p>

          {gameState.score > highScore ? (
            <motion.div
              className="text-yellow-500 font-bold mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              🏆 New High Score! 🏆
            </motion.div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              High Score: {highScore}
            </p>
          )}

          <div className="flex gap-3">
            <motion.button
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
            >
              Play Again
            </motion.button>

            <motion.button
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'RESET_GAME' } as any)}
            >
              Change Settings
            </motion.button>
          </div>
        </div>
      ) : (
        <>
          {/* Game HUD */}
          <GameHUD
            score={gameState.score}
            combo={gameState.combo}
            timeLeft={gameState.timeLeft}
            lives={gameState.lives}
            level={gameState.level}
            gameMode={gameMode}
            isPaused={gameState.isPaused}
            onPause={togglePause}
            hasShield={gameState.hasShield}
            pointsMultiplier={gameState.pointsMultiplier}
            hasMagnet={gameState.hasMagnet}
            challengeProgress={gameState.challengeProgress}
            challengeGoal={challengeGoal}
          />

          {/* Powerups */}
          {gameState.powerups.length > 0 && (
            <div className="absolute top-12 right-2 flex gap-1">
              {gameState.powerups.map((powerup, index) => (
                <PowerupComponent
                  key={`${powerup}-${index}`}
                  powerup={powerup}
                  onUse={usePowerup}
                />
              ))}
            </div>
          )}

          {/* Pause overlay */}
          {gameState.isPaused && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold mb-4">Game Paused</h3>
                <motion.button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePause}
                >
                  Resume
                </motion.button>
              </div>
            </div>
          )}

          {/* Level up notification */}
          <AnimatePresence>
            {showLevelUp && (
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg text-center"
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 20 }}
                >
                  <h3 className="text-2xl font-bold mb-2">Level Up!</h3>
                  <p className="text-xl">Challenge Level {challengeLevel} Completed!</p>
                  <p className="mt-2">+15 seconds added</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Targets */}
          <AnimatePresence>
            {gameState.targets.map(target => (
              <TargetComponent
                key={target.id}
                target={target}
                onHit={hitTarget}
              />
            ))}
          </AnimatePresence>

          {/* Score Popups */}
          <AnimatePresence>
            {gameState.scorePopups.map(popup => (
              <ScorePopupComponent key={popup.id} popup={popup} />
            ))}
          </AnimatePresence>
        </>
      )}

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">How to Play</h2>
                <button
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setShowTutorial(false)}
                  aria-label="Close tutorial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-1">Targets</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>
                    <strong>Regular targets:</strong> Worth 1 point each.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
                    <strong>Bonus targets:</strong> Worth 5 points but disappear faster.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                    <strong>Special targets:</strong> Worth 10 points and always give powerups.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    <strong>Bombs:</strong> Avoid these! They subtract 10 points.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-1">Game Modes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Classic:</strong> Score as many points as possible in the time limit.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Survival:</strong> Play until you run out of lives. Missing targets or hitting bombs costs lives.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Zen:</strong> Relaxed mode with a longer time limit and no penalties.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Challenge:</strong> Complete progressively harder levels to unlock achievements.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-1">Powerups</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>⏱️ Slow Motion:</strong> Slows down the game for 5 seconds.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>2️⃣ Double Points:</strong> Doubles all points earned for 8 seconds.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>🛡️ Shield:</strong> Protects you from the next bomb hit.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>🧲 Magnet:</strong> Pulls targets toward the center for 10 seconds.
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <motion.button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTutorial(false)}
                >
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}