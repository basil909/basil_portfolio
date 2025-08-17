// Web Worker for offloading intensive game calculations
// This helps keep the main thread free for UI rendering

// Target types
type TargetType = 'normal' | 'bonus' | 'bomb' | 'special';

// Target interface
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

// Message types
type WorkerMessage = 
  | { type: 'UPDATE_TARGETS'; targets: Target[]; deltaTime: number; hasMagnet: boolean }
  | { type: 'GENERATE_TARGET'; difficulty: string; level: number }
  | { type: 'CALCULATE_POINTS'; combo: number; targetPoints: number; multiplier: number };

// Difficulty settings
const DIFFICULTY_SETTINGS: Record<string, any> = {
  easy: {
    sizeMultiplier: 1.2,
    bombProbability: 0.05,
    bonusProbability: 0.15,
    specialProbability: 0.01,
    movingTargetProbability: 0.2
  },
  medium: {
    sizeMultiplier: 1,
    bombProbability: 0.1,
    bonusProbability: 0.15,
    specialProbability: 0.02,
    movingTargetProbability: 0.4
  },
  hard: {
    sizeMultiplier: 0.8,
    bombProbability: 0.15,
    bonusProbability: 0.1,
    specialProbability: 0.03,
    movingTargetProbability: 0.6
  },
  expert: {
    sizeMultiplier: 0.7,
    bombProbability: 0.2,
    bonusProbability: 0.1,
    specialProbability: 0.05,
    movingTargetProbability: 0.8
  }
};

// Update target positions based on movement patterns
function updateTargets(targets: Target[], deltaTime: number, hasMagnet: boolean): Target[] {
  return targets.map(target => {
    if (!target.movePattern || target.movePattern === 'static') {
      return applyMagnet(target, hasMagnet);
    }
    
    let newX = target.x;
    let newY = target.y;
    
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
    
    const updatedTarget = { ...target, x: newX, y: newY };
    return applyMagnet(updatedTarget, hasMagnet);
  });
}

// Apply magnet effect to targets
function applyMagnet(target: Target, hasMagnet: boolean): Target {
  if (!hasMagnet || target.type === 'bomb') return target;
  
  const centerX = 50;
  const centerY = 50;
  const dx = centerX - target.x;
  const dy = centerY - target.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > 5) {
    const newX = target.x + (dx / distance) * 0.5;
    const newY = target.y + (dy / distance) * 0.5;
    return { ...target, x: newX, y: newY };
  }
  
  return target;
}

// Generate a new target
function generateTarget(difficulty: string, level: number): Target {
  const diffSettings = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.medium;
  
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
  let moveData: any = {};
  
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
  return {
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
}

// Calculate points with combo multiplier
function calculatePoints(combo: number, targetPoints: number, multiplier: number): number {
  const comboMultiplier = Math.min(5, 1 + Math.floor(combo / 3) * 0.5);
  return Math.round(targetPoints * comboMultiplier * multiplier);
}

// Handle messages from the main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;
  
  switch (message.type) {
    case 'UPDATE_TARGETS':
      const updatedTargets = updateTargets(message.targets, message.deltaTime, message.hasMagnet);
      self.postMessage({ type: 'TARGETS_UPDATED', targets: updatedTargets });
      break;
      
    case 'GENERATE_TARGET':
      const newTarget = generateTarget(message.difficulty, message.level);
      self.postMessage({ type: 'TARGET_GENERATED', target: newTarget });
      break;
      
    case 'CALCULATE_POINTS':
      const points = calculatePoints(message.combo, message.targetPoints, message.multiplier);
      self.postMessage({ type: 'POINTS_CALCULATED', points });
      break;
  }
};

// Export empty object to make TypeScript happy with the module format
export {};