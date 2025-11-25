'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
};

const achievements: Achievement[] = [
  {
    id: 'visit_home',
    title: 'Welcome!',
    description: 'You visited my portfolio',
    icon: '🏠',
    points: 10,
    unlocked: false
  },
  {
    id: 'visit_about',
    title: 'Getting to Know Me',
    description: 'You checked out my About section',
    icon: '👋',
    points: 20,
    unlocked: false
  },
  {
    id: 'visit_projects',
    title: 'Project Explorer',
    description: 'You viewed my projects',
    icon: '🚀',
    points: 30,
    unlocked: false
  },
  {
    id: 'visit_contact',
    title: 'Let\'s Connect',
    description: 'You reached out through the contact form',
    icon: '📬',
    points: 40,
    unlocked: false
  },
  {
    id: 'toggle_theme',
    title: 'Dark Side',
    description: 'You toggled the theme',
    icon: '🌓',
    points: 15,
    unlocked: false
  },
  {
    id: 'click_social',
    title: 'Social Butterfly',
    description: 'You checked out my social links',
    icon: '🦋',
    points: 25,
    unlocked: false
  }
];

export default function AchievementSystem() {
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Load achievements from localStorage if available
    const savedAchievements = localStorage.getItem('portfolio_achievements');
    const savedPoints = localStorage.getItem('portfolio_points');

    if (savedAchievements) {
      setUserAchievements(JSON.parse(savedAchievements));
    }

    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints, 10));
    }
  }, []);

  // Separate useEffect for event listeners to avoid dependency issues
  useEffect(() => {
    // Set up event listeners for achievements
    const unlockAchievement = (id: string) => {
      const achievement = achievements.find(a => a.id === id);
      if (achievement && !userAchievements.some(a => a.id === id)) {
        const newAchievement = { ...achievement, unlocked: true };
        const updatedAchievements = [...userAchievements, newAchievement];
        const newTotalPoints = totalPoints + newAchievement.points;

        setUserAchievements(updatedAchievements);
        setCurrentAchievement(newAchievement);
        setShowAchievement(true);
        setTotalPoints(newTotalPoints);

        localStorage.setItem('portfolio_achievements', JSON.stringify(updatedAchievements));
        localStorage.setItem('portfolio_points', newTotalPoints.toString());

        setTimeout(() => {
          setShowAchievement(false);
        }, 3000);
      }
    };

    // Unlock home achievement on load
    unlockAchievement('visit_home');

    // Set up intersection observers for section-based achievements
    const aboutSection = document.getElementById('about');
    const projectsSection = document.getElementById('projects');
    const contactSection = document.getElementById('contact');

    const aboutObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          unlockAchievement('visit_about');
          break;
        }
      }
    }, { threshold: 0.5 });

    const projectsObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          unlockAchievement('visit_projects');
          break;
        }
      }
    }, { threshold: 0.5 });

    const contactObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          unlockAchievement('visit_contact');
          break;
        }
      }
    }, { threshold: 0.5 });

    if (aboutSection) aboutObserver.observe(aboutSection);
    if (projectsSection) projectsObserver.observe(projectsSection);
    if (contactSection) contactObserver.observe(contactSection);

    // Listen for theme toggle
    const handleThemeToggle = () => {
      unlockAchievement('toggle_theme');
    };

    // Listen for social link clicks
    const handleSocialClick = () => {
      unlockAchievement('click_social');
    };

    document.addEventListener('themeToggle', handleThemeToggle);

    // Create a MutationObserver to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' &&
          (mutation.target as Element).classList.contains('dark')) {
          unlockAchievement('toggle_theme');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    const socialLinks = document.querySelectorAll('a[href*="github"], a[href*="linkedin"], a[href*="mailto"]');
    socialLinks.forEach(link => {
      link.addEventListener('click', handleSocialClick);
    });

    return () => {
      if (aboutSection) aboutObserver.unobserve(aboutSection);
      if (projectsSection) projectsObserver.unobserve(projectsSection);
      if (contactSection) contactObserver.unobserve(contactSection);

      document.removeEventListener('themeToggle', handleThemeToggle);

      socialLinks.forEach(link => {
        link.removeEventListener('click', handleSocialClick);
      });

      observer.disconnect();
    };
  }, [userAchievements, totalPoints]);

  return (
    <>
      {/* Achievement popup */}
      <AnimatePresence>
        {showAchievement && currentAchievement && (
          <motion.div
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 flex items-center gap-3 max-w-xs"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-2xl">
              {currentAchievement.icon}
            </div>
            <div>
              <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">{currentAchievement.title}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">+{currentAchievement.points} points</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Points display */}
      <motion.div
        className="fixed top-20 right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg px-3 py-1 z-40 flex items-center gap-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <span className="text-yellow-500">⭐</span>
        <span className="font-bold text-sm">{totalPoints}</span>
      </motion.div>

      {/* Achievement button */}
      <motion.button
        className="fixed bottom-4 left-4 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          // Show achievements panel (could be implemented as a modal)
          alert(`You've unlocked ${userAchievements.length} out of ${achievements.length} achievements!`);
        }}
      >
        🏆
      </motion.button>
    </>
  );
}