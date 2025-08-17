'use client';

import React from 'react';
import { motion } from 'framer-motion';

const shapes = [
  { type: 'circle', color: 'bg-blue-500/20', size: 'w-16 h-16 rounded-full' },
  { type: 'square', color: 'bg-purple-500/20', size: 'w-12 h-12 rounded-md' },
  { type: 'triangle', color: 'border-l-transparent border-r-transparent border-b-purple-500/30', size: 'w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px]' },
  { type: 'donut', color: 'border-green-500/30', size: 'w-16 h-16 rounded-full border-4' },
  { type: 'plus', color: 'bg-yellow-500/20', size: 'w-12 h-3 rounded-md' },
  { type: 'plus-vertical', color: 'bg-yellow-500/20', size: 'w-3 h-12 rounded-md' },
];

export default function FloatingElements() {
  // Pre-calculate all the random values to avoid recalculations on each render
  const elements = React.useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const shape = shapes[i % shapes.length];
      const delay = i * 0.3;
      const duration = 10 + Math.random() * 20;
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      
      return {
        id: i,
        shape,
        delay,
        duration,
        initialX,
        initialY
      };
    });
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute ${element.shape.color} ${element.shape.size}`}
          initial={{ 
            x: `${element.initialX}vw`, 
            y: `${element.initialY}vh`,
            opacity: 0,
            rotate: 0
          }}
          animate={{ 
            x: [
              `${element.initialX}vw`, 
              `${(element.initialX + 20) % 100}vw`, 
              `${(element.initialX - 10 + 100) % 100}vw`, 
              `${element.initialX}vw`
            ],
            y: [
              `${element.initialY}vh`, 
              `${(element.initialY - 20 + 100) % 100}vh`, 
              `${(element.initialY + 10) % 100}vh`, 
              `${element.initialY}vh`
            ],
            opacity: [0, 0.5, 0.5, 0],
            rotate: [0, 180, 360, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: element.duration, 
            delay: element.delay,
            ease: "easeInOut"
          }}
        >
          {element.shape.type === 'plus' && (
            <motion.div 
              className={`absolute left-4 top-0 ${element.shape.color} w-3 h-12 rounded-md`}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, delay: element.delay }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}