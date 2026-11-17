'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import CountUp from './CountUp';
import RevealSection, { revealDelay } from './RevealSection';
import SectionHeading, { Accent } from './SectionHeading';

type Project = {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
  period: string;
  category: string;
  /** How the system works, input → output. Drawn as the card's diagram. */
  flow: readonly string[];
  /** Index (in `flow`) of the model step, highlighted in the diagram. */
  core: number;
  /** Two headline numbers, taken from the description. */
  metrics: readonly { value: number; decimals?: number; suffix?: string; label: string }[];
};

const projects: Project[] = [
  {
    title: 'Vakyam AI – Malayalam Learning Chatbot',
    description:
      'Built an interactive chatbot using reinforcement learning and rule-based grammar to teach Malayalam to beginners. Achieved 95.2% F1-score and 99.6% accuracy in improved English ↔ Malayalam translation with contextual responses and speech support. Deployed MPT-7B-Chat via Hugging Face for multilingual generation and used Rasa for efficient intent classification and dialogue management.',
    tech: ['Python', 'Rasa', 'Hugging Face', 'MPT-7B-Chat', 'Reinforcement Learning'],
    github: 'https://github.com/basil909/malayalam-chatbot',
    period: "Feb'25 – Mar'25",
    category: 'AI',
    flow: ['Learner message', 'Rasa intents + dialogue', 'RL policy + grammar rules', 'MPT-7B-Chat', 'Reply with speech'],
    core: 3,
    metrics: [
      { value: 95.2, decimals: 1, suffix: '%', label: 'F1-score' },
      { value: 99.6, decimals: 1, suffix: '%', label: 'Translation accuracy' },
    ],
  },
  {
    title: 'Malicious or Benign URL Detection',
    description:
      'Developed a multi-class classification approach to distinguish between Benign, Phishing, Malware, and Defacement URLs. Extracted numerical features from raw URLs for machine learning models and implemented an ensemble classifier using Random Forest, LightGBM, and XGBoost.',
    tech: ['Python', 'Jupyter', 'Streamlit', 'Machine Learning', 'XGBoost', 'Random Forest', 'LightGBM'],
    github: 'https://github.com/basil909?tab=repositories',
    period: "Apr'24 – May'24",
    category: 'Security',
    flow: ['Raw URL', 'Numerical feature extraction', 'RF · LightGBM · XGBoost', 'Ensemble vote', 'Benign · Phishing · Malware · Defacement'],
    core: 3,
    metrics: [
      { value: 4, label: 'URL classes' },
      { value: 3, label: 'Models in the ensemble' },
    ],
  },
  {
    title: 'SecureScan – PII Redaction System',
    description:
      'Developed an AI-powered web app that detects and redacts Aadhaar, PAN, and passport numbers using fine-tuned DeBERTaV3 for token classification. Integrated OCR with Tesseract, PDF processing with PyMuPDF, and a FastAPI + Next.js stack to automate redaction of sensitive PII in documents and images.',
    tech: ['Python', 'DeBERTaV3', 'FastAPI', 'Next.js', 'Tesseract OCR', 'PyMuPDF'],
    github: 'https://github.com/basil909/pii-detection-system',
    period: "Jun'23 – Jul'23",
    category: 'Security',
    flow: ['PDF or image', 'Tesseract OCR · PyMuPDF', 'DeBERTaV3 token classifier', 'Aadhaar · PAN · passport spans', 'Redacted document'],
    core: 2,
    metrics: [
      { value: 3, label: 'ID types redacted' },
      { value: 2, label: 'Input formats (PDF, image)' },
    ],
  },
];

const LABEL = 'font-mono text-[11px] uppercase tracking-[0.22em]';

const GRID_FINE =
  'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)';

const githubPath =
  'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z';

/* -------------------------------------------------------------------------- */
/*  Flow diagram — the project's actual pipeline, instead of stock artwork.   */
/* -------------------------------------------------------------------------- */

function FlowDiagram({ steps, core, title }: { steps: readonly string[]; core: number; title: string }) {
  const ref = useRef<HTMLElement>(null);

  // `data-live` drives the CSS: steps light up in order the first time the card
  // is seen, and the packet loop only runs while it is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        el.dataset['live'] = String(visible);
        if (visible) el.dataset['seen'] = 'true';
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className="flow relative hidden h-full items-center bg-[var(--surface)] px-6 py-10 sm:px-10 lg:flex">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: GRID_FINE, backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />
      <ol className="relative mx-auto w-full max-w-[340px] space-y-5" aria-label={`How ${title} works`}>
        {/* Spine + a data packet running down it, visible in the gaps between steps. */}
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="flow-packet absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 bg-[var(--primary)]" aria-hidden="true" />

        {steps.map((step, i) => {
          const isCore = i === core;
          const isEnd = i === 0 || i === steps.length - 1;
          return (
            <li
              key={step}
              className={`flow-step relative z-10 border px-4 py-2.5 text-center font-mono text-[11px] leading-5 ${
                isCore
                  ? 'flow-core border-[var(--primary)] bg-[var(--primary)] font-bold text-[var(--ink)]'
                  : isEnd
                    ? 'border-[var(--line-strong)] bg-[var(--background)] text-[var(--foreground)]'
                    : 'border-[var(--line)] bg-[var(--background)] text-[var(--muted)]'
              }`}
              style={{ '--i': i } as CSSProperties}
            >
              {step}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

/** Phones: the same pipeline as one compact line instead of stacked boxes. */
function FlowInline({ steps, core, title }: { steps: readonly string[]; core: number; title: string }) {
  return (
    <ol
      className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px] leading-5 lg:hidden"
      aria-label={`How ${title} works`}
    >
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={
              i === core
                ? 'bg-[var(--primary)] px-1.5 font-bold text-[var(--ink)]'
                : 'text-[var(--muted)]'
            }
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <span className="text-[var(--muted)]" aria-hidden="true">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

export default function Projects() {
  return (
    <RevealSection
      id="projects"
      className="relative border-t border-[var(--line)] bg-[var(--background)] px-5 py-20 text-[var(--foreground)] sm:px-8 lg:px-12 lg:py-28"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="03"
          label="Selected work"
          id="projects-title"
          lines={[<span key="b">Built to <Accent>solve</Accent></span>]}
          aside="A small archive of intelligent systems, security tools, and experiments built around practical problems."
        />

        <div className="space-y-6">
          {projects.map((project, index) => (
            <article
              key={project.title}
              style={revealDelay(0.08 + index * 0.06)}
              className="reveal grid overflow-hidden border border-[var(--line)] bg-[var(--background)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
            >
              <FlowDiagram steps={project.flow} core={project.core} title={project.title} />

              <div className="flex flex-col border-t border-[var(--line)] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <p className={`${LABEL} text-[var(--muted)]`}>
                  <span className="text-[var(--primary-text)]">{project.category}</span>
                  <span className="mx-3" aria-hidden="true">·</span>
                  {project.period}
                </p>

                <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em] sm:text-3xl">
                  {project.title}
                </h3>

                <FlowInline steps={project.flow} core={project.core} title={project.title} />

                <dl className="mt-6 grid max-w-md grid-cols-2 gap-6 border-y border-[var(--line)] py-5">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col-reverse">
                      <dt className="mt-1 text-xs text-[var(--muted)]">{m.label}</dt>
                      <dd className="font-[family-name:var(--font-orbitron)] text-3xl font-black tracking-[-0.03em] text-[var(--primary-text)] sm:text-4xl">
                        <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 text-sm leading-7 text-[var(--muted)] sm:text-base">{project.description}</p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="border border-[var(--line)] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-6 pt-8">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 border-b border-[var(--foreground)] pb-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-[var(--primary-text)] hover:text-[var(--primary-text)] focus:outline-none focus-visible:border-[var(--primary-text)] focus-visible:text-[var(--primary-text)]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={githubPath} />
                    </svg>
                    View code
                    <span className="sr-only"> for {project.title} on GitHub (opens in a new tab)</span>
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 border-b border-[var(--primary-text)] pb-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--primary-text)] focus:outline-none focus-visible:text-[var(--foreground)]"
                    >
                      Live demo ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
