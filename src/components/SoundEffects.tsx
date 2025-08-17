'use client';
import { useEffect, useRef, useCallback } from 'react';

// Sound effect names type
type SoundName = 
  | 'pop' 
  | 'unlock' 
  | 'achievement' 
  | 'levelup' 
  | 'match' 
  | 'nomatch' 
  | 'complete' 
  | 'bomb' 
  | 'bonus'
  | 'shield'
  | 'slowmo'
  | 'flip';

// Sound effect configuration
const SOUNDS: Record<SoundName, { src: string; defaultVolume: number; }> = {
  pop: { src: '/pop.mp3', defaultVolume: 0.2 },
  unlock: { src: '/unlock.mp3', defaultVolume: 0.2 },
  achievement: { src: '/achievement.mp3', defaultVolume: 0.3 },
  levelup: { src: '/levelup.mp3', defaultVolume: 0.3 },
  match: { src: '/match.mp3', defaultVolume: 0.2 },
  nomatch: { src: '/nomatch.mp3', defaultVolume: 0.2 },
  complete: { src: '/complete.mp3', defaultVolume: 0.3 },
  bomb: { src: '/bomb.mp3', defaultVolume: 0.3 },
  bonus: { src: '/bonus.mp3', defaultVolume: 0.2 },
  shield: { src: '/shield.mp3', defaultVolume: 0.2 },
  slowmo: { src: '/slowmo.mp3', defaultVolume: 0.2 },
  flip: { src: '/flip.mp3', defaultVolume: 0.2 }
};

// Preload sound effects for better performance
export default function SoundEffects() {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const audioContext = useRef<AudioContext | null>(null);
  const audioBuffers = useRef<Record<string, AudioBuffer>>({});
  const isMounted = useRef(true);
  
  // Initialize Web Audio API if supported
  const initAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContext.current = new AudioContext();
        return true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported, falling back to HTML Audio');
    }
    return false;
  }, []);
  
  // Load audio buffer
  const loadAudioBuffer = useCallback(async (name: string, url: string) => {
    if (!audioContext.current) return;
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      if (isMounted.current && audioContext.current) {
        const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
        audioBuffers.current[name] = audioBuffer;
      }
    } catch (e) {
      console.warn(`Failed to load audio: ${name}`, e);
    }
  }, []);
  
  // Play sound with Web Audio API
  const playWithWebAudio = useCallback((name: string, volume = SOUNDS[name as SoundName]?.defaultVolume || 0.2) => {
    if (!audioContext.current || !audioBuffers.current[name]) return false;
    
    try {
      // Resume audio context if it's suspended (browser autoplay policy)
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
      
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffers.current[name];
      
      const gainNode = audioContext.current.createGain();
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      source.start(0);
      return true;
    } catch (e) {
      console.warn(`Failed to play audio with Web Audio API: ${name}`, e);
      return false;
    }
  }, []);
  
  // Play sound with HTML Audio fallback
  const playWithHtmlAudio = useCallback((name: string, volume = SOUNDS[name as SoundName]?.defaultVolume || 0.2) => {
    const audio = audioRefs.current[name];
    if (!audio) return false;
    
    try {
      audio.volume = volume;
      audio.currentTime = 0;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, create a new audio element for next time
          const newAudio = new Audio(SOUNDS[name as SoundName]?.src);
          newAudio.preload = 'auto';
          audioRefs.current[name] = newAudio;
        });
      }
      return true;
    } catch (e) {
      console.warn(`Failed to play audio with HTML Audio: ${name}`, e);
      return false;
    }
  }, []);
  
  useEffect(() => {
    // Check if Web Audio API is supported
    const hasWebAudio = initAudioContext();
    
    // Preload all sounds
    Object.entries(SOUNDS).forEach(([name, config]) => {
      // Always create HTML Audio elements as fallback
      const audio = new Audio(config.src);
      audio.preload = 'auto';
      audioRefs.current[name] = audio;
      
      // Also load into Web Audio API if supported
      if (hasWebAudio) {
        loadAudioBuffer(name, config.src);
      }
    });
    
    // Add global function to play sounds
    window.playSound = (name: string, volume?: number) => {
      // Try Web Audio API first, fall back to HTML Audio
      if (!playWithWebAudio(name, volume)) {
        playWithHtmlAudio(name, volume);
      }
    };
    
    return () => {
      isMounted.current = false;
      
      // Clean up audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
      
      // Close audio context
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, [initAudioContext, loadAudioBuffer, playWithWebAudio, playWithHtmlAudio]);
  
  return null; // This component doesn't render anything
}

// Add type definition for the global window object
declare global {
  interface Window {
    playSound: (name: string, volume?: number) => void;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}