'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

type Project = {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
  image: string;
  period: string;
  category: string;
  index: string;
};

const projects: Project[] = [
  {
    index: '01',
    title: 'Vakyam AI – Malayalam Learning Chatbot',
    description:
      'Built an interactive chatbot using reinforcement learning and rule-based grammar to teach Malayalam to beginners. Achieved 95.2% F1-score and 99.6% accuracy in improved English ↔ Malayalam translation with contextual responses and speech support. Deployed MPT-7B-Chat via Hugging Face for multilingual generation and used Rasa for efficient intent classification and dialogue management.',
    tech: [
      'Python',
      'Rasa',
      'Hugging Face',
      'MPT-7B-Chat',
      'Reinforcement Learning',
    ],
    github: 'https://github.com/basil909/malayalam-chatbot',
    image: '/images/vakyam-ai.png',
    period: "Feb'25 – Mar'25",
    category: 'AI',
  },
  {
    index: '02',
    title: 'Malicious or Benign URL Detection',
    description:
      'Developed a multi-class classification approach to distinguish between Benign, Phishing, Malware, and Defacement URLs. Extracted numerical features from raw URLs for machine learning models and implemented an ensemble classifier using Random Forest, LightGBM, and XGBoost.',
    tech: [
      'Python',
      'Jupyter',
      'Streamlit',
      'Machine Learning',
      'XGBoost',
      'Random Forest',
      'LightGBM',
    ],
    github: 'https://github.com/basil909?tab=repositories',
    image: '/images/url-detection.png',
    period: "Apr'24 – May'24",
    category: 'Security',
  },
  {
    index: '03',
    title: 'SecureScan – PII Redaction System',
    description:
      'Developed an AI-powered web app that detects and redacts Aadhaar, PAN, and passport numbers using fine-tuned DeBERTaV3 for token classification. Integrated OCR with Tesseract, PDF processing with PyMuPDF, and a FastAPI + Next.js stack to automate redaction of sensitive PII in documents and images.',
    tech: [
      'Python',
      'DeBERTaV3',
      'FastAPI',
      'Next.js',
      'Tesseract OCR',
      'PyMuPDF',
    ],
    github: 'https://github.com/basil909?tab=repositories',
    image: '/images/securescan.png',
    period: "Jun'23 – Jul'23",
    category: 'Security',
  },
];

const githubPath =
  'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z';

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={githubPath} />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

function ProjectVisual({ project, active }: { project: Project; active: boolean }) {
  return (
    <div className="relative h-full min-h-[330px] overflow-hidden bg-[#0d0d0c]">
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className={`object-cover transition-all duration-700 ease-out ${
          active
            ? 'scale-[1.035] grayscale-0 brightness-100'
            : 'scale-100 grayscale brightness-[0.72]'
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.2)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px)] bg-[48px_48px] opacity-30" />

      <div className="absolute inset-x-5 top-5 flex items-start justify-between">
        <span className="border border-[var(--primary)]/60 bg-black/50 px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          {project.category}
        </span>

        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/45">
          {project.period}
        </span>
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-[var(--primary)]" />
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/50">
            System / {project.index}
          </span>
        </div>

        <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/40">
          Input → Model → Output
        </div>
      </div>

      {/* Focus corners */}
      <span className="absolute left-3 top-3 h-6 w-6 border-l border-t border-[var(--primary)]/70" />
      <span className="absolute right-3 top-3 h-6 w-6 border-r border-t border-white/20" />
      <span className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-white/20" />
      <span className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-[var(--primary)]/70" />
    </div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.08 });
  const reducedMotion = useReducedMotion() ?? false;

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const visibleProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (triggerRef.current?.isConnected) triggerRef.current.focus();
      triggerRef.current = null;
    };
  }, [selectedProject]);

  const openProject = (
    project: Project,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    triggerRef.current = event.currentTarget;
    setSelectedProject(project);
  };

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 24 },
    animate: inView
      ? {
          opacity: 1,
          y: 0,
          transition: reducedMotion
            ? { duration: 0 }
            : { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
        }
      : { opacity: 0, y: reducedMotion ? 0 : 24 },
  });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8 lg:px-12 lg:py-32"
      aria-labelledby="projects-title"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[5%] top-0 h-full w-px bg-[var(--line)] opacity-60" />
        <div className="absolute right-[5%] top-0 h-full w-px bg-[var(--line)] opacity-60" />
        <div className="absolute left-[5%] top-[18%] h-px w-[22%] bg-[var(--primary)]/[0.07]" />
        <div className="absolute right-[5%] top-[76%] h-px w-[18%] bg-[var(--primary)]/[0.06]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <motion.header {...reveal()} className="border-b border-[var(--line)] pb-6">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--primary)]">
                  03 / Selected work
                </span>
                <span className="hidden h-px w-14 bg-[var(--primary)] sm:block" />
              </div>

              <h2
                id="projects-title"
                className="font-[var(--font-orbitron)] text-[clamp(3rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.075em]"
              >
                BUILT TO
                <br />
                <span className="text-[var(--primary)]">SOLVE.</span>
              </h2>
            </div>

            <div className="max-w-sm text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Systems / 03
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                A small archive of intelligent systems, security tools, and
                experiments built around practical problems.
              </p>
            </div>
          </div>
        </motion.header>

        <motion.div
          {...reveal(0.08)}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] py-5"
        >
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
            {categories.map((category) => {
              const active = activeFilter === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  aria-pressed={active}
                  className={`border px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                    active
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-black'
                      : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
            {visibleProjects.length.toString().padStart(2, '0')} systems
          </span>
        </motion.div>

        <div className="mt-8 space-y-5">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.article
                key={project.title}
                layout
                {...reveal(0.12 + index * 0.06)}
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -12, scale: 0.99 }
                }
                className="group relative grid overflow-hidden border border-[var(--line)] bg-[var(--surface)] lg:min-h-[520px] lg:grid-cols-[1.12fr_0.88fr]"
              >
                <button
                  type="button"
                  onClick={(event) => openProject(project, event)}
                  className="relative block min-h-[330px] cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary)]"
                  aria-label={`Open ${project.title} details`}
                >
                  <ProjectVisual project={project} active={false} />
                </button>

                <div className="flex flex-col border-t border-[var(--line)] lg:border-l lg:border-t-0">
                  <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--muted-dark)]">
                      Project / {project.index}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--primary)]">
                      {project.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
                    <h3 className="max-w-xl font-[var(--font-orbitron)] text-2xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-4xl">
                      {project.title}
                    </h3>

                    <div className="mt-7 border-l-2 border-[var(--primary)] pl-5">
                      <p className="text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-8">
                      <div className="mb-3 flex items-center justify-between border-b border-[var(--line)] pb-2">
                        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--foreground)]">
                          Stack
                        </span>
                        <span className="font-mono text-[8px] text-[var(--muted-dark)]">
                          {project.tech.length.toString().padStart(2, '0')} modules
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="border border-[var(--line)] px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--muted)] transition-colors group-hover:border-[var(--primary)]/50 group-hover:text-[var(--foreground)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-10">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/open inline-flex items-center gap-4 border-b border-[var(--foreground)] pb-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:border-[var(--primary)] focus-visible:text-[var(--primary)]"
                      >
                        <span className="h-4 w-4">
                          <GithubIcon />
                        </span>
                        Open on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          {...reveal(0.25)}
          className="mt-12 flex flex-col gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted-dark)]">
            Archive / End of selected systems
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted-dark)]">
            More experiments in progress
          </span>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedProject(null);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={dialogRef}
              className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto border border-[var(--line)] bg-[var(--surface)] shadow-2xl"
              initial={
                reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.99 }
              }
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-[280px] bg-[#0d0d0c] lg:min-h-[580px]">
                  <Image
                    src={selectedProject.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-7 sm:top-7">
                    <span className="bg-[var(--primary)] px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-black">
                      {selectedProject.category}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/50">
                      {selectedProject.period}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-5 right-5 sm:left-7 sm:bottom-8">
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/50">
                      System / {selectedProject.index}
                    </span>
                    <h3
                      id="project-dialog-title"
                      className="mt-2 max-w-2xl font-[var(--font-orbitron)] text-2xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl"
                    >
                      {selectedProject.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4 sm:px-8">
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--primary)]">
                      System report
                    </span>

                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="flex h-9 w-9 items-center justify-center border border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                      aria-label="Close project details"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--muted-dark)]">
                        Overview
                      </span>
                      <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div className="mt-10 border-t border-[var(--line)] pt-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-mono text-[8px] uppercase tracking-[0.18em]">
                          Modules
                        </span>
                        <span className="font-mono text-[8px] text-[var(--muted-dark)]">
                          {selectedProject.tech.length.toString().padStart(2, '0')}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((tech) => (
                          <span
                            key={tech}
                            className="border border-[var(--line)] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`mt-auto grid gap-3 border-t border-[var(--line)] pt-7 ${
                        selectedProject.demo ? 'sm:grid-cols-2' : ''
                      }`}
                    >
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 border border-[var(--line)] px-4 py-4 font-mono text-[9px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                      >
                        <span className="h-4 w-4">
                          <GithubIcon />
                        </span>
                        GitHub
                      </a>

                      {selectedProject.demo && (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-3 bg-[var(--primary)] px-4 py-4 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-black transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                        >
                          <span className="h-4 w-4">
                            <ExternalIcon />
                          </span>
                          Live demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
