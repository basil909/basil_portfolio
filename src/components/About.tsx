'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

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
    aiml: [
      { name: 'Hugging Face Transformers', icon: '🤗' },
      { name: 'DeBERTaV3 / MPT-7B', icon: '🧠' },
      { name: 'XGBoost / Random Forest', icon: '🌲' },
      { name: 'Reinforcement Learning', icon: '🤖' }
    ],
    technologies: [
      { name: 'Python / Rasa', icon: '🐍' },
      { name: 'FastAPI / Next.js', icon: '⚡' },
      { name: 'OCR / Document Processing', icon: '📄' },
      { name: 'Streamlit / Jupyter', icon: '📊' }
    ]
  };

  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-gray-900">
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
          <motion.div className="space-y-6 order-2 md:order-1" variants={itemVariants}>
            <motion.p
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
              variants={itemVariants}
            >
              I'm Muhammed Basil, a Computer Science undergraduate with a strong passion for web development, AI, and immersive technologies.
              I enjoy building intelligent, user-focused applications that bridge research and practical use. My recent project, Vakyam AI,
              is a Malayalam language learning assistant that combines rule-based grammar with reinforcement learning techniques.
            </motion.p>

            <motion.p
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
              variants={itemVariants}
            >
              I'm particularly interested in how AI can enhance language learning and human-computer interaction.
              Whether working on full-stack web apps or exploring cognitive simulation, I aim to create solutions
              that are meaningful and adaptive. I'm currently looking for opportunities to grow as a developer and
              contribute to impactful, forward-thinking projects.
            </motion.p>

            <motion.div
              className="mt-8"
              variants={itemVariants}
            >
              <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-500">🛠️</span> Technical Arsenal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <span>🧠</span> AI & ML
                  </h4>
                  <ul className="space-y-2">
                    {skills.aiml.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-xs">{skill.icon}</span>
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <span>💻</span> Technologies
                  </h4>
                  <ul className="space-y-2">
                    {skills.technologies.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-xs">{skill.icon}</span>
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center order-1 md:order-2"
            variants={itemVariants}
          >
            <motion.div
              className="relative w-72 h-72 md:w-96 md:h-96"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl rotate-6 opacity-20 blur-xl animate-pulse"></div>
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                <Image
                  src="/images/avatar.png"
                  alt="Muhammed Basil"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <motion.div
                className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Open to work</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}