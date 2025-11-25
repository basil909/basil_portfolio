'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
};

const achievementsList: Achievement[] = [
  { id: 'visit_home', title: 'Welcome!', description: 'You visited my portfolio', icon: '🏠', points: 10, unlocked: false },
  { id: 'visit_about', title: 'Getting to Know Me', description: 'You checked out my About section', icon: '👋', points: 20, unlocked: false },
  { id: 'visit_projects', title: 'Project Explorer', description: 'You viewed my projects', icon: '🚀', points: 30, unlocked: false },
  { id: 'visit_contact', title: "Let's Connect", description: 'You reached out through contact', icon: '📬', points: 40, unlocked: false },
  { id: 'toggle_theme', title: 'Dark Side', description: 'You toggled the theme', icon: '🌓', points: 15, unlocked: false },
  { id: 'click_social', title: 'Social Butterfly', description: 'You checked out my social links', icon: '🦋', points: 25, unlocked: false },
];

export default function AchievementSystem() {
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  // load once
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_achievements');
      const savedPoints = localStorage.getItem('portfolio_points');
      if (saved) setUserAchievements(JSON.parse(saved));
      if (savedPoints) setTotalPoints(parseInt(savedPoints, 10) || 0);
    } catch (e) {
      // ignore parse errors
      console.error('Failed to read achievements from localStorage', e);
    }
  }, []);

  // unified unlock function using functional updates (avoids stale closures)
  const unlockAchievement = (id: string) => {
    setUserAchievements((prev) => {
      if (prev.some(a => a.id === id)) return prev; // already unlocked

      const base = achievementsList.find(a => a.id === id);
      if (!base) return prev;

      const newAchievement: Achievement = { ...base, unlocked: true };
      const updated = [...prev, newAchievement];

      // update points safely with functional update
      setTotalPoints((prevPts) => {
        const newPts = prevPts + newAchievement.points;
        try { localStorage.setItem('portfolio_points', newPts.toString()); } catch { }
        return newPts;
      });

      // persist achievements array
      try { localStorage.setItem('portfolio_achievements', JSON.stringify(updated)); } catch { }

      // show popup
      setCurrentAchievement(newAchievement);
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);

      return updated;
    });
  };

  // observers & DOM listeners
  useEffect(() => {
    // unlock home once (idempotent thanks to unlockAchievement)
    unlockAchievement('visit_home');

    const aboutSection = typeof document !== 'undefined' ? document.getElementById('about') : null;
    const projectsSection = typeof document !== 'undefined' ? document.getElementById('projects') : null;
    const contactSection = typeof document !== 'undefined' ? document.getElementById('contact') : null;

    const observerOptions = { threshold: 0.5 };

    const makeObserver = (idToUnlock: string) =>
      new IntersectionObserver((entries) => {
        // iterate entries safely — avoid entries[0]
        for (const entry of entries) {
          if (entry?.isIntersecting) {
            unlockAchievement(idToUnlock);
            break;
          }
        }
      }, observerOptions);

    const aboutObserver = makeObserver('visit_about');
    const projectsObserver = makeObserver('visit_projects');
    const contactObserver = makeObserver('visit_contact');

    if (aboutSection) aboutObserver.observe(aboutSection);
    if (projectsSection) projectsObserver.observe(projectsSection);
    if (contactSection) contactObserver.observe(contactSection);

    const handleThemeToggle = () => unlockAchievement('toggle_theme');
    document.addEventListener('themeToggle', handleThemeToggle);

    // MutationObserver for class changes on <html> (detect dark class)
    const mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class' && (m.target as Element).classList.contains('dark')) {
          unlockAchievement('toggle_theme');
          break;
        }
      }
    });
    mutationObserver.observe(document.documentElement, { attributes: true });

    // social links click detection
    const socialLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(
      'a[href*="github"], a[href*="linkedin"], a[href*="mailto"]'
    ));
    const handleSocialClick = () => unlockAchievement('click_social');
    socialLinks.forEach(link => link.addEventListener('click', handleSocialClick));

    return () => {
      if (aboutSection) aboutObserver.unobserve(aboutSection);
      if (projectsSection) projectsObserver.unobserve(projectsSection);
      if (contactSection) contactObserver.unobserve(contactSection);

      aboutObserver.disconnect();
      projectsObserver.disconnect();
      contactObserver.disconnect();

      document.removeEventListener('themeToggle', handleThemeToggle);
      socialLinks.forEach(link => link.removeEventListener('click', handleSocialClick));
      mutationObserver.disconnect();
    };
    // intentionally no dependencies for observers so they mount once.
    // unlockAchievement uses functional updates and thus is safe here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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

      <motion.div
        className="fixed top-20 right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg px-3 py-1 z-40 flex items-center gap-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <span className="text-yellow-500">⭐</span>
        <span className="font-bold text-sm">{totalPoints}</span>
      </motion.div>

      <motion.button
        className="fixed bottom-4 left-4 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          alert(`You've unlocked ${userAchievements.length} out of ${achievementsList.length} achievements!`);
        }}
      >
        🏆
      </motion.button>
    </>
  );
}
