'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useGame } from './GameContext';

// Physics types
interface Vector2D {
  x: number;
  y: number;
}

interface PhysicsObject {
  id: number;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  mass: number;
  radius: number;
  restitution: number; // Bounciness
  color: string;
  fixed: boolean;
  type: 'player' | 'goal' | 'obstacle' | 'bouncer' | 'gravity';
  grabbed: boolean;
  completed?: boolean;
}

interface Level {
  id: number;
  name: string;
  description: string;
  objects: PhysicsObject[];
  gravity: Vector2D;
  timeLimit: number;
  starTimes: [number, number, number]; // 3 stars, 2 stars, 1 star time thresholds
}

// Constants
const PHYSICS_TIMESTEP = 1 / 60; // 60 fps
const GRAVITY = { x: 0, y: 0.2 };
const FRICTION = 0.98;
const MAX_VELOCITY = 15;
const PLAYER_RADIUS = 20;
const GOAL_RADIUS = 25;

// Color schemes
const COLORS = {
  player: 'bg-blue-500',
  goal: 'bg-green-500',
  obstacle: 'bg-gray-700',
  bouncer: 'bg-yellow-500',
  gravity: 'bg-purple-500',
  completed: 'bg-indigo-600',
  background: 'bg-gray-100 dark:bg-gray-800/50',
  border: 'border-indigo-100 dark:border-indigo-900/30',
  text: 'text-indigo-600 dark:text-indigo-400',
  button: 'bg-indigo-600 hover:bg-indigo-700',
  buttonAlt: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
};

// Game levels
const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Simple Roll',
    description: 'Roll the blue ball to the green goal',
    objects: [
      { id: 1, position: { x: 20, y: 20 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 1, radius: PLAYER_RADIUS, restitution: 0.7, color: COLORS.player, fixed: false, type: 'player', grabbed: false },
      { id: 2, position: { x: 80, y: 80 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 1, radius: GOAL_RADIUS, restitution: 0.2, color: COLORS.goal, fixed: true, type: 'goal', grabbed: false },
      { id: 3, position: { x: 50, y: 50 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 5, radius: 15, restitution: 0.2, color: COLORS.obstacle, fixed: true, type: 'obstacle', grabbed: false },
    ],
    gravity: { x: 0, y: 0.2 },
    timeLimit: 30,
    starTimes: [10, 15, 20]
  },
  {
    id: 2,
    name: 'Bounce Around',
    description: 'Use the yellow bouncers to reach the goal',
    objects: [
      { id: 1, position: { x: 20, y: 20 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 1, radius: PLAYER_RADIUS, restitution: 0.7, color: COLORS.player, fixed: false, type: 'player', grabbed: false },
      { id: 2, position: { x: 80, y: 80 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 1, radius: GOAL_RADIUS, restitution: 0.2, color: COLORS.goal, fixed: true, type: 'goal', grabbed: false },
      { id: 3, position: { x: 50, y: 30 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 2, radius: 15, restitution: 1.5, color: COLORS.bouncer, fixed: true, type: 'bouncer', grabbed: false },
      { id: 4, position: { x: 30, y: 70 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 2, radius: 15, restitution: 1.5, color: COLORS.bouncer, fixed: true, type: 'bouncer', grabbed: false },
      { id: 5, position: { x: 70, y: 40 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 5, radius: 20, restitution: 0.2, color: COLORS.obstacle, fixed: true, type: 'obstacle', grabbed: false },
    ],
    gravity: { x: 0, y: 0.2 },
    timeLimit: 45,
    starTimes: [15, 25, 35]
  },
  {
    id: 3,
    name: 'Gravity Wells',
    description: 'Navigate through gravity fields to reach the goal',
    objects: [
      { id: 1, position: { x: 20, y: 20 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 1, radius: PLAYER_RADIUS, restitution: 0.7, color: COLORS.player, fixed: false, type: 'player', grabbed: false },
      { id: 2, position: { x: 80, y: 80 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 1, radius: GOAL_RADIUS, restitution: 0.2, color: COLORS.goal, fixed: true, type: 'goal', grabbed: false },
      { id: 3, position: { x: 50, y: 50 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 10, radius: 25, restitution: 0.2, color: COLORS.gravity, fixed: true, type: 'gravity', grabbed: false },
      { id: 4, position: { x: 30, y: 70 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 5, radius: 15, restitution: 0.2, color: COLORS.obstacle, fixed: true, type: 'obstacle', grabbed: false },
      { id: 5, position: { x: 70, y: 30 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, mass: 5, radius: 15, restitution: 0.2, color: COLORS.obstacle, fixed: true, type: 'obstacle', grabbed: false },
    ],
    gravity: { x: 0, y: 0.1 },
    timeLimit: 60,
    starTimes: [20, 35, 50]
  }
];

// Memoized components
const PhysicsObject = memo(({ 
  object, 
  scale, 
  onGrab, 
  onRelease 
}: { 
  object: PhysicsObject; 
  scale: number;
  onGrab: (id: number) => void;
  onRelease: (id: number) => void;
}) => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      x: object.position.x * scale,
      y: object.position.y * scale,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    });
  }, [object.position.x, object.position.y, scale, controls]);
  
  // Determine object class based on type
  const objectClass = object.completed ? COLORS.completed : COLORS[object.type];
  
  // Special rendering for different object types
  const renderInnerContent = () => {
    switch (object.type) {
      case 'player':
        return <div className="absolute inset-0 flex items-center justify-center text-white">🔵</div>;
      case 'goal':
        return <div className="absolute inset-0 flex items-center justify-center text-white">🎯</div>;
      case 'bouncer':
        return <div className="absolute inset-0 flex items-center justify-center text-white">↕️</div>;
      case 'gravity':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-ping absolute h-full w-full rounded-full bg-purple-400 opacity-20"></div>
            <div className="relative text-white">🌀</div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      className={`absolute rounded-full shadow-md ${objectClass}`}
      style={{
        width: object.radius * 2 * scale,
        height: object.radius * 2 * scale,
        marginLeft: -object.radius * scale,
        marginTop: -object.radius * scale,
      }}
      animate={controls}
      onMouseDown={() => !object.fixed && onGrab(object.id)}
      onMouseUp={() => onRelease(object.id)}
      onMouseLeave={() => object.grabbed && onRelease(object.id)}
      whileHover={!object.fixed ? { scale: 1.05 } : {}}
      whileTap={!object.fixed ? { scale: 0.95 } : {}}
    >
      {renderInnerContent()}
    </motion.div>
  );
});

PhysicsObject.displayName = 'PhysicsObject';

// Star rating component
const StarRating = memo(({ earned, total = 3 }: { earned: number; total?: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={i < earned ? "text-yellow-400" : "text-gray-300"}>
          ★
        </div>
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

// Level selection button
const LevelButton = memo(({ 
  level, 
  isCompleted, 
  stars, 
  isSelected, 
  onClick 
}: { 
  level: Level; 
  isCompleted: boolean;
  stars: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      className={`p-3 rounded-lg ${isSelected ? COLORS.button + ' text-white' : COLORS.buttonAlt} w-full text-left`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold">{level.name}</div>
          <div className="text-xs opacity-80">{level.description}</div>
        </div>
        {isCompleted && (
          <div>
            <StarRating earned={stars} />
          </div>
        )}
      </div>
    </motion.button>
  );
});

LevelButton.displayName = 'LevelButton';

// Main component
export default function PhysicsPuzzle() {
  const { addPoints, addExperience, unlockAchievement } = useGame();
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const [objects, setObjects] = useState<PhysicsObject[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [completedLevels, setCompletedLevels] = useState<Record<number, number>>({});
  const [showTutorial, setShowTutorial] = useState(false);
  const [stars, setStars] = useState(0);
  
  // Refs
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const grabbedObjectRef = useRef<number | null>(null);
  const mousePositionRef = useRef<Vector2D>({ x: 0, y: 0 });
  const gameScaleRef = useRef<number>(1);
  
  // Load completed levels from localStorage
  useEffect(() => {
    // Avoid hydration mismatch by using setTimeout
    if (typeof window === 'undefined') return;
    
    // Use a flag to track if component is mounted
    let isMounted = true;
    
    // Delay loading from localStorage to avoid hydration issues
    const loadTimeout = setTimeout(() => {
      if (!isMounted) return;
      
      const savedLevels = localStorage.getItem('physics_puzzle_completed');
      if (savedLevels) {
        try {
          setCompletedLevels(JSON.parse(savedLevels));
        } catch (e) {
          console.error('Error loading completed levels:', e);
        }
      }
    }, 0);
    
    return () => {
      isMounted = false;
      clearTimeout(loadTimeout);
    };
  }, []);
  
  // Save completed levels to localStorage
  useEffect(() => {
    if (Object.keys(completedLevels).length > 0) {
      localStorage.setItem('physics_puzzle_completed', JSON.stringify(completedLevels));
    }
  }, [completedLevels]);
  
  // Initialize level
  const initLevel = useCallback((level: Level) => {
    setCurrentLevel(level);
    setObjects(JSON.parse(JSON.stringify(level.objects))); // Deep clone
    setTimeLeft(level.timeLimit);
    setGameActive(false);
    setGameCompleted(false);
    setShowLevelSelect(false);
    
    // Calculate game scale based on container size
    if (gameContainerRef.current) {
      const containerWidth = gameContainerRef.current.clientWidth;
      gameScaleRef.current = containerWidth / 100; // 100 is our virtual game width
    }
  }, []);
  
  // Start game
  const startGame = useCallback(() => {
    setGameActive(true);
    lastUpdateTimeRef.current = performance.now();
    startPhysicsLoop();
    
    // Play start sound
    if (typeof window !== 'undefined' && window.playSound) {
      window.playSound('unlock', 0.3);
    }
  }, []);
  
  // Complete level
  const completeLevel = useCallback(() => {
    setGameActive(false);
    setGameCompleted(true);
    
    // Calculate stars based on time
    const timeUsed = currentLevel.timeLimit - timeLeft;
    let earnedStars = 1;
    
    if (timeUsed <= currentLevel.starTimes[0]) {
      earnedStars = 3;
    } else if (timeUsed <= currentLevel.starTimes[1]) {
      earnedStars = 2;
    }
    
    setStars(earnedStars);
    
    // Update completed levels
    setCompletedLevels(prev => {
      const currentStars = prev[currentLevel.id] || 0;
      return {
        ...prev,
        [currentLevel.id]: Math.max(currentStars, earnedStars)
      };
    });
    
    // Add points and experience
    const points = earnedStars * 10;
    addPoints(points);
    addExperience(points * 2);
    
    // Unlock achievements
    if (earnedStars === 3) {
      unlockAchievement('physics_master');
    }
    
    if (Object.keys(completedLevels).length + 1 >= LEVELS.length) {
      unlockAchievement('puzzle_solver');
    }
    
    // Play completion sound
    if (typeof window !== 'undefined' && window.playSound) {
      window.playSound('complete', 0.3);
    }
  }, [currentLevel, timeLeft, addPoints, addExperience, unlockAchievement, completedLevels]);
  
  // Physics loop
  const startPhysicsLoop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const updatePhysics = (timestamp: number) => {
      if (!gameActive) {
        animationFrameRef.current = requestAnimationFrame(updatePhysics);
        return;
      }
      
      const deltaTime = timestamp - lastUpdateTimeRef.current;
      if (deltaTime > 16) { // Cap at ~60fps
        lastUpdateTimeRef.current = timestamp;
        
        // Update physics
        setObjects(prevObjects => {
          const updatedObjects = [...prevObjects];
          
          // Apply forces and update positions
          for (let i = 0; i < updatedObjects.length; i++) {
            const obj = updatedObjects[i];
            
            // Skip fixed objects
            if (obj.fixed) continue;
            
            // Skip if being grabbed
            if (obj.grabbed) continue;
            
            // Apply gravity
            obj.acceleration.x = currentLevel.gravity.x;
            obj.acceleration.y = currentLevel.gravity.y;
            
            // Apply gravity from gravity wells
            for (let j = 0; j < updatedObjects.length; j++) {
              const other = updatedObjects[j];
              if (other.type === 'gravity') {
                const dx = other.position.x - obj.position.x;
                const dy = other.position.y - obj.position.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);
                
                if (dist > 0) {
                  const force = other.mass / distSq * 0.5;
                  const forceX = force * dx / dist;
                  const forceY = force * dy / dist;
                  
                  obj.acceleration.x += forceX;
                  obj.acceleration.y += forceY;
                }
              }
            }
            
            // Update velocity
            obj.velocity.x += obj.acceleration.x;
            obj.velocity.y += obj.acceleration.y;
            
            // Apply friction
            obj.velocity.x *= FRICTION;
            obj.velocity.y *= FRICTION;
            
            // Cap velocity
            const speed = Math.sqrt(obj.velocity.x * obj.velocity.x + obj.velocity.y * obj.velocity.y);
            if (speed > MAX_VELOCITY) {
              obj.velocity.x = (obj.velocity.x / speed) * MAX_VELOCITY;
              obj.velocity.y = (obj.velocity.y / speed) * MAX_VELOCITY;
            }
            
            // Update position
            obj.position.x += obj.velocity.x;
            obj.position.y += obj.velocity.y;
            
            // Boundary collision
            if (obj.position.x < obj.radius) {
              obj.position.x = obj.radius;
              obj.velocity.x = -obj.velocity.x * obj.restitution;
            } else if (obj.position.x > 100 - obj.radius) {
              obj.position.x = 100 - obj.radius;
              obj.velocity.x = -obj.velocity.x * obj.restitution;
            }
            
            if (obj.position.y < obj.radius) {
              obj.position.y = obj.radius;
              obj.velocity.y = -obj.velocity.y * obj.restitution;
            } else if (obj.position.y > 100 - obj.radius) {
              obj.position.y = 100 - obj.radius;
              obj.velocity.y = -obj.velocity.y * obj.restitution;
            }
          }
          
          // Check for collisions between objects
          for (let i = 0; i < updatedObjects.length; i++) {
            const obj1 = updatedObjects[i];
            
            for (let j = i + 1; j < updatedObjects.length; j++) {
              const obj2 = updatedObjects[j];
              
              // Calculate distance
              const dx = obj2.position.x - obj1.position.x;
              const dy = obj2.position.y - obj1.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = obj1.radius + obj2.radius;
              
              // Check for collision
              if (distance < minDistance) {
                // Collision detected
                
                // Check if player reached goal
                if ((obj1.type === 'player' && obj2.type === 'goal') || 
                    (obj1.type === 'goal' && obj2.type === 'player')) {
                  completeLevel();
                  return updatedObjects;
                }
                
                // Skip collision resolution if either object is fixed
                if (obj1.grabbed || obj2.grabbed) continue;
                
                // Calculate collision normal
                const nx = dx / distance;
                const ny = dy / distance;
                
                // Calculate relative velocity
                const vx = obj2.velocity.x - obj1.velocity.x;
                const vy = obj2.velocity.y - obj1.velocity.y;
                
                // Calculate relative velocity along normal
                const velocityAlongNormal = vx * nx + vy * ny;
                
                // Do not resolve if objects are moving away from each other
                if (velocityAlongNormal > 0) continue;
                
                // Calculate restitution (bounciness)
                const restitution = Math.max(obj1.restitution, obj2.restitution);
                
                // Calculate impulse scalar
                let j = -(1 + restitution) * velocityAlongNormal;
                j /= 1 / obj1.mass + 1 / obj2.mass;
                
                // Apply impulse
                const impulseX = j * nx;
                const impulseY = j * ny;
                
                // Update velocities
                if (!obj1.fixed) {
                  obj1.velocity.x -= impulseX / obj1.mass;
                  obj1.velocity.y -= impulseY / obj1.mass;
                }
                
                if (!obj2.fixed) {
                  obj2.velocity.x += impulseX / obj2.mass;
                  obj2.velocity.y += impulseY / obj2.mass;
                }
                
                // Correct position to prevent objects from sticking
                const correctionPercent = 0.2;
                const correction = (minDistance - distance) * correctionPercent;
                
                const correctionX = nx * correction;
                const correctionY = ny * correction;
                
                if (!obj1.fixed) {
                  obj1.position.x -= correctionX / 2;
                  obj1.position.y -= correctionY / 2;
                }
                
                if (!obj2.fixed) {
                  obj2.position.x += correctionX / 2;
                  obj2.position.y += correctionY / 2;
                }
                
                // Play collision sound for significant collisions
                if (Math.abs(velocityAlongNormal) > 3) {
                  if (typeof window !== 'undefined' && window.playSound) {
                    const volume = Math.min(0.3, Math.abs(velocityAlongNormal) / 10);
                    window.playSound('pop', volume);
                  }
                }
              }
            }
          }
          
          return updatedObjects;
        });
      }
      
      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };
    
    animationFrameRef.current = requestAnimationFrame(updatePhysics);
  }, [gameActive, currentLevel.gravity, completeLevel]);
  
  // Handle grabbing objects
  const handleGrab = useCallback((id: number) => {
    grabbedObjectRef.current = id;
    
    setObjects(prev => 
      prev.map(obj => 
        obj.id === id ? { ...obj, grabbed: true, velocity: { x: 0, y: 0 } } : obj
      )
    );
  }, []);
  
  // Handle releasing objects
  const handleRelease = useCallback((id: number) => {
    if (grabbedObjectRef.current === id) {
      grabbedObjectRef.current = null;
      
      setObjects(prev => 
        prev.map(obj => 
          obj.id === id ? { ...obj, grabbed: false } : obj
        )
      );
    }
  }, []);
  
  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (gameContainerRef.current && grabbedObjectRef.current !== null) {
      const rect = gameContainerRef.current.getBoundingClientRect();
      const scale = gameScaleRef.current;
      
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      
      mousePositionRef.current = { x, y };
      
      setObjects(prev => 
        prev.map(obj => 
          obj.id === grabbedObjectRef.current 
            ? { ...obj, position: { x, y } } 
            : obj
        )
      );
    }
  }, []);
  
  // Game timer
  useEffect(() => {
    if (!gameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Calculate total stars
  const totalStars = Object.values(completedLevels).reduce((sum, stars) => sum + stars, 0);
  const maxStars = LEVELS.length * 3;
  
  return (
    <div className={`PhysicsPuzzle relative w-full h-96 ${COLORS.background} rounded-xl overflow-hidden mt-8 border-2 ${COLORS.border} shadow-lg`}>
      {showLevelSelect ? (
        <div className="absolute inset-0 flex flex-col p-6">
          <h3 className={`text-2xl font-bold mb-4 ${COLORS.text}`}>Physics Puzzle</h3>
          
          <div className="mb-4 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Solve physics-based puzzles by guiding the blue ball to the green target
            </p>
            <div className="flex justify-center items-center gap-2 mt-2">
              <StarRating earned={totalStars} total={maxStars} />
              <span className="text-sm text-gray-500">
                {totalStars}/{maxStars} stars
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-3">
              {LEVELS.map(level => (
                <LevelButton
                  key={level.id}
                  level={level}
                  isCompleted={!!completedLevels[level.id]}
                  stars={completedLevels[level.id] || 0}
                  isSelected={currentLevel.id === level.id}
                  onClick={() => initLevel(level)}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <motion.button
              className={`px-6 py-2 ${COLORS.buttonAlt} rounded-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTutorial(true)}
            >
              How to Play
            </motion.button>
          </div>
        </div>
      ) : gameCompleted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className={`text-xl font-bold mb-2 ${COLORS.text}`}>Level Complete!</h3>
          
          <div className="my-4">
            <StarRating earned={stars} />
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Time: {currentLevel.timeLimit - timeLeft} seconds
          </p>
          
          <div className="flex gap-3">
            <motion.button
              className={`px-6 py-2 ${COLORS.button} text-white rounded-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => initLevel(currentLevel)}
            >
              Play Again
            </motion.button>
            
            <motion.button
              className={`px-6 py-2 ${COLORS.buttonAlt} rounded-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLevelSelect(true)}
            >
              Level Select
            </motion.button>
          </div>
        </div>
      ) : (
        <div 
          ref={gameContainerRef} 
          className="absolute inset-0"
          onMouseMove={handleMouseMove}
        >
          {/* Game UI */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
            <div className={`${COLORS.button} text-white px-3 py-1 rounded-full text-sm font-bold`}>
              Level {currentLevel.id}: {currentLevel.name}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                Time: {timeLeft}s
              </div>
              
              <button 
                className="bg-white dark:bg-gray-700 p-1 rounded-full"
                onClick={() => setShowLevelSelect(true)}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Physics objects */}
          {objects.map(object => (
            <PhysicsObject
              key={object.id}
              object={object}
              scale={gameScaleRef.current}
              onGrab={handleGrab}
              onRelease={handleRelease}
            />
          ))}
          
          {/* Start button */}
          {!gameActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <motion.button
                className={`px-6 py-2 ${COLORS.button} text-white rounded-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
              >
                Start Level
              </motion.button>
            </div>
          )}
        </div>
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
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-1">Goal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Guide the blue ball to the green target in each level.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-1">Controls</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Click and drag the blue ball to position it, then release to let physics take over.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-1">Objects</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <span><strong>Blue Ball:</strong> The player object you control</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span><strong>Green Target:</strong> The goal to reach</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-700"></div>
                      <span><strong>Gray Obstacles:</strong> Solid objects that block your path</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <span><strong>Yellow Bouncers:</strong> Bounce your ball with extra force</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                      <span><strong>Purple Gravity Wells:</strong> Pull your ball toward them</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold mb-1">Stars</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Earn up to 3 stars per level based on how quickly you complete it.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <motion.button
                  className={`px-6 py-2 ${COLORS.button} text-white rounded-lg`}
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