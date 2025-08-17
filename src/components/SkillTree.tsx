'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Skill = {
  id: string;
  name: string;
  level: number;
  icon: string;
  category: string;
  description: string;
  unlocked: boolean;
  requires?: string[];
};

const skillsData: Skill[] = [
  // AI & ML Skills
  {
    id: 'python',
    name: 'Python',
    level: 5,
    icon: '🐍',
    category: 'Programming',
    description: 'Advanced Python programming for AI and data science',
    unlocked: true
  },
  {
    id: 'ml_basics',
    name: 'ML Fundamentals',
    level: 4,
    icon: '📊',
    category: 'AI & ML',
    description: 'Core machine learning algorithms and concepts',
    unlocked: true,
    requires: ['python']
  },
  {
    id: 'deep_learning',
    name: 'Deep Learning',
    level: 3,
    icon: '🧠',
    category: 'AI & ML',
    description: 'Neural networks and deep learning architectures',
    unlocked: false,
    requires: ['ml_basics']
  },
  {
    id: 'nlp',
    name: 'NLP',
    level: 4,
    icon: '💬',
    category: 'AI & ML',
    description: 'Natural language processing techniques',
    unlocked: false,
    requires: ['deep_learning']
  },
  {
    id: 'transformers',
    name: 'Transformers',
    level: 3,
    icon: '🤖',
    category: 'AI & ML',
    description: 'Advanced transformer models like BERT and GPT',
    unlocked: false,
    requires: ['nlp']
  },
  
  // Web Development Skills
  {
    id: 'html_css',
    name: 'HTML & CSS',
    level: 4,
    icon: '🌐',
    category: 'Web Dev',
    description: 'Frontend web development fundamentals',
    unlocked: true
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    level: 4,
    icon: '📜',
    category: 'Web Dev',
    description: 'Core JavaScript programming',
    unlocked: true,
    requires: ['html_css']
  },
  {
    id: 'react',
    name: 'React',
    level: 3,
    icon: '⚛️',
    category: 'Web Dev',
    description: 'Building interactive UIs with React',
    unlocked: false,
    requires: ['javascript']
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    level: 2,
    icon: '▲',
    category: 'Web Dev',
    description: 'Full-stack React framework',
    unlocked: false,
    requires: ['react']
  }
];

export default function SkillTree() {
  const [skills, setSkills] = useState<Skill[]>(skillsData);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillPoints, setSkillPoints] = useState(3);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const canUnlockSkill = (skill: Skill) => {
    if (skill.unlocked || skillPoints <= 0) return false;
    
    // Check if required skills are unlocked
    if (skill.requires) {
      return skill.requires.every(reqId => 
        skills.find(s => s.id === reqId)?.unlocked
      );
    }
    
    return true;
  };

  const unlockSkill = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    
    if (skill && canUnlockSkill(skill)) {
      setSkills(skills.map(s => 
        s.id === skillId ? { ...s, unlocked: true } : s
      ));
      setSkillPoints(prev => prev - 1);
      
      // Play unlock sound
      try {
        const audio = new Audio('/unlock.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors
      } catch (e) {
        // Ignore errors
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="SkillTree bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-indigo-100 dark:border-indigo-900/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Skill Tree</h3>
        <motion.div 
          className="bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            {skillPoints} skill points
          </span>
        </motion.div>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* AI & ML Skills */}
        <div>
          <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-4">AI & Machine Learning</h4>
          <div className="space-y-4">
            {skills
              .filter(skill => skill.category === 'AI & ML' || skill.category === 'Programming')
              .map(skill => (
                <motion.div
                  key={skill.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer relative ${
                    skill.unlocked 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : canUnlockSkill(skill)
                        ? 'border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500'
                        : 'border-gray-200 dark:border-gray-700 opacity-50'
                  }`}
                  variants={itemVariants}
                  whileHover={skill.unlocked || canUnlockSkill(skill) ? { scale: 1.03 } : {}}
                  onMouseEnter={() => setShowTooltip(skill.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  onClick={() => {
                    if (canUnlockSkill(skill)) {
                      unlockSkill(skill.id);
                    } else if (skill.unlocked) {
                      setSelectedSkill(skill);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{skill.icon}</div>
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      <div className="flex mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`w-3 h-3 rounded-full mr-1 ${
                              i < skill.level 
                                ? 'bg-blue-500' 
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  {showTooltip === skill.id && (
                    <motion.div 
                      className="absolute z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-48 top-full left-1/2 transform -translate-x-1/2 mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{skill.description}</p>
                      {!skill.unlocked && skill.requires && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Requires: </span>
                          {skill.requires.map(req => {
                            const reqSkill = skills.find(s => s.id === req);
                            return reqSkill ? reqSkill.name : req;
                          }).join(', ')}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
        
        {/* Web Dev Skills */}
        <div>
          <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-4">Web Development</h4>
          <div className="space-y-4">
            {skills
              .filter(skill => skill.category === 'Web Dev')
              .map(skill => (
                <motion.div
                  key={skill.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer relative ${
                    skill.unlocked 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : canUnlockSkill(skill)
                        ? 'border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500'
                        : 'border-gray-200 dark:border-gray-700 opacity-50'
                  }`}
                  variants={itemVariants}
                  whileHover={skill.unlocked || canUnlockSkill(skill) ? { scale: 1.03 } : {}}
                  onMouseEnter={() => setShowTooltip(skill.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  onClick={() => {
                    if (canUnlockSkill(skill)) {
                      unlockSkill(skill.id);
                    } else if (skill.unlocked) {
                      setSelectedSkill(skill);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{skill.icon}</div>
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      <div className="flex mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`w-3 h-3 rounded-full mr-1 ${
                              i < skill.level 
                                ? 'bg-purple-500' 
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  {showTooltip === skill.id && (
                    <motion.div 
                      className="absolute z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-48 top-full left-1/2 transform -translate-x-1/2 mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{skill.description}</p>
                      {!skill.unlocked && skill.requires && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Requires: </span>
                          {skill.requires.map(req => {
                            const reqSkill = skills.find(s => s.id === req);
                            return reqSkill ? reqSkill.name : req;
                          }).join(', ')}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
      
      {/* Skill Details Modal */}
      {selectedSkill && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedSkill(null)}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{selectedSkill.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{selectedSkill.name}</h3>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-4 h-4 rounded-full mr-1 ${
                        i < selectedSkill.level 
                          ? selectedSkill.category === 'Web Dev' 
                            ? 'bg-purple-500' 
                            : 'bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {selectedSkill.description}
            </p>
            
            <div className="flex justify-end">
              <motion.button 
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                onClick={() => setSelectedSkill(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Unlock skills to showcase your expertise. Click on unlocked skills for details.
        </p>
      </div>
    </div>
  );
}