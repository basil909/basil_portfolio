'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const skills = {
    aiml: ['Hugging Face Transformers', 'DeBERTaV3 / MPT-7B', 'XGBoost / Random Forest', 'Reinforcement Learning'],
    technologies: ['Python / Rasa', 'FastAPI / Next.js', 'OCR / Document Processing', 'Streamlit / Jupyter']
  };

  return (
    <section id="about" className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
      <motion.div 
        ref={ref}
        className="max-w-6xl mx-auto"
        variants={variants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-blue-600 dark:text-blue-400">Me</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Passionate about creating digital experiences that make a difference
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.p 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              variants={itemVariants}
            >
              I'm Muhammed Basil, a Computer Science undergraduate with a strong passion for web development, AI, and immersive technologies. 
              I enjoy building intelligent, user-focused applications that bridge research and practical use. My recent project, Vakyam AI, 
              is a Malayalam language learning assistant that combines rule-based grammar with reinforcement learning techniques.
            </motion.p>
            
            <motion.p 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              variants={itemVariants}
            >
              I'm particularly interested in how AI can enhance language learning and human-computer interaction. 
              Whether working on full-stack web apps or exploring cognitive simulation, I aim to create solutions 
              that are meaningful and adaptive. I'm currently looking for opportunities to grow as a developer and 
              contribute to impactful, forward-thinking projects.
            </motion.p>

            <motion.div 
              className="grid grid-cols-2 gap-4 mt-8"
              variants={itemVariants}
            >
              <motion.div
                className="col-span-2 text-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  ✨ Check out my interactive skill tree below! ✨
                </p>
              </motion.div>
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <h3 className="font-semibold text-blue-600 dark:text-blue-400">AI & ML</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {skills.aiml.map((skill, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + (index * 0.1) }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-blue-500 dark:text-blue-400">▹</span> {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <h3 className="font-semibold text-purple-600 dark:text-purple-400">Technologies</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {skills.technologies.map((skill, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + (index * 0.1) }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-purple-500 dark:text-purple-400">▹</span> {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="text-white text-6xl">👨‍💻</div>
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ⚡
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}