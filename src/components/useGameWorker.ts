'use client';

import { useRef, useEffect, useCallback } from 'react';

// Type definitions for worker messages
type WorkerRequest = 
  | { type: 'UPDATE_TARGETS'; targets: any[]; deltaTime: number; hasMagnet: boolean }
  | { type: 'GENERATE_TARGET'; difficulty: string; level: number }
  | { type: 'CALCULATE_POINTS'; combo: number; targetPoints: number; multiplier: number };

type WorkerResponse = 
  | { type: 'TARGETS_UPDATED'; targets: any[] }
  | { type: 'TARGET_GENERATED'; target: any }
  | { type: 'POINTS_CALCULATED'; points: number };

// Hook for using a web worker with game logic
export function useGameWorker() {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (data: any) => void>>(new Map());
  
  // Initialize worker
  useEffect(() => {
    // Only create worker in browser environment
    if (typeof window === 'undefined') return;
    
    // Use a flag to track if component is mounted
    let isMounted = true;
    
    // Wrap in setTimeout to avoid hydration issues
    const initTimeout = setTimeout(() => {
      if (!isMounted) return;
      
      try {
        // Create worker
        workerRef.current = new Worker(new URL('./GameWorker.ts', import.meta.url));
        
        // Set up message handler
        workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
          if (!isMounted) return;
          
          const { type, ...data } = event.data;
          
          // Call the appropriate callback
          const callback = callbacksRef.current.get(type);
          if (callback) {
            callback(data);
          }
        };
      } catch (error) {
        console.error('Failed to create game worker:', error);
      }
    }, 0);
    
    // Clean up worker on unmount
    return () => {
      isMounted = false;
      clearTimeout(initTimeout);
      
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);
  
  // Register a callback for a specific response type
  const registerCallback = useCallback((type: string, callback: (data: any) => void) => {
    callbacksRef.current.set(type, callback);
    
    // Return function to unregister callback
    return () => {
      callbacksRef.current.delete(type);
    };
  }, []);
  
  // Send message to worker
  const sendMessage = useCallback((message: WorkerRequest) => {
    if (workerRef.current) {
      workerRef.current.postMessage(message);
    } else {
      // Fallback for when worker isn't available
      switch (message.type) {
        case 'UPDATE_TARGETS':
          // Simple fallback for target updates
          const callback = callbacksRef.current.get('TARGETS_UPDATED');
          if (callback) {
            callback({ targets: message.targets });
          }
          break;
          
        case 'GENERATE_TARGET':
          // Fallback for target generation
          const genCallback = callbacksRef.current.get('TARGET_GENERATED');
          if (genCallback) {
            genCallback({ 
              target: {
                id: Date.now(),
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
                size: 30,
                hit: false,
                points: 1,
                speed: 1,
                type: 'normal'
              } 
            });
          }
          break;
          
        case 'CALCULATE_POINTS':
          // Fallback for points calculation
          const pointsCallback = callbacksRef.current.get('POINTS_CALCULATED');
          if (pointsCallback) {
            const comboMultiplier = Math.min(5, 1 + Math.floor(message.combo / 3) * 0.5);
            const points = Math.round(message.targetPoints * comboMultiplier * message.multiplier);
            pointsCallback({ points });
          }
          break;
      }
    }
  }, []);
  
  // Check if worker is available
  const isWorkerAvailable = useCallback(() => {
    return !!workerRef.current;
  }, []);
  
  return {
    sendMessage,
    registerCallback,
    isWorkerAvailable
  };
}