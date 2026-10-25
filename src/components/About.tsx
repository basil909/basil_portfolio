'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const SKILLS = {
  aiml: ['Hugging Face Transformers', 'DeBERTaV3 / MPT-7B', 'XGBoost / Random Forest', 'Reinforcement Learning'],
  technologies: ['Python / Rasa', 'FastAPI / Next.js', 'OCR / Document Processing', 'Streamlit / Jupyter'],
} as const;

const STATS = [
  { id: 'focus', value: 'AI / ML', label: 'Primary focus' },
  { id: 'eng', value: 'FULL-STACK', label: 'Engineering' },
  { id: 'nlp', value: 'NLP', label: 'Core interest' },
] as const;

const STATUS = [
  { label: 'System status', value: 'Online', accent: true },
  { label: 'Current mode', value: 'Building', accent: false },
] as const;

const CORNERS = [
  'left-3 top-3 border-l border-t',
  'right-3 top-3 border-r border-t',
  'bottom-3 left-3 border-b border-l',
  'bottom-3 right-3 border-b border-r',
] as const;

/* -------------------------------------------------------------------------- */
/*  Style tokens (shared with Hero so the two sections read as one system)    */
/* -------------------------------------------------------------------------- */

const DISPLAY = 'font-[family-name:var(--font-orbitron)]';
const LABEL = 'font-mono text-[9px] uppercase tracking-[0.2em]';
const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]';

const GRID_BG =
  'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)';
const GRID_MASK = 'linear-gradient(to bottom, transparent 0%, black 15%, black 78%, transparent 100%)';

const GRID_STYLE: CSSProperties = {
  backgroundImage: GRID_BG,
  backgroundSize: '64px 64px',
  maskImage: GRID_MASK,
  WebkitMaskImage: GRID_MASK,
};

const SCAN_STYLE: CSSProperties = {
  background:
    'linear-gradient(to bottom, transparent 0%, transparent 48%, rgba(255,255,255,0.08) 50%, transparent 52%, transparent 100%)',
};

/** Stagger helper for `.reveal` elements (see RevealSection). */
const delay = (seconds: number) => ({ '--reveal-delay': `${seconds}s` }) as CSSProperties;

/* -------------------------------------------------------------------------- */
/*  Scroll reveal (no animation library)                                      */
/*  One IntersectionObserver flips `data-revealed` on the <section> once; any */
/*  descendant with `.reveal` then transitions in via CSS. The flag is set on */
/*  the DOM node directly, so nothing re-renders.                             */
/* -------------------------------------------------------------------------- */

const REVEAL_EASE = 'cubic-bezier(.16,1,.3,1)';

const REVEAL_CSS = `
.reveal{opacity:0;transform:translateY(28px);transition:opacity .8s ${REVEAL_EASE} var(--reveal-delay,0s),transform .8s ${REVEAL_EASE} var(--reveal-delay,0s)}
[data-revealed="true"] .reveal{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}
@media (scripting:none){.reveal{opacity:1;transform:none;transition:none}}
`;

function RevealSection({ children, ...props }: ComponentPropsWithoutRef<'section'>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      el.dataset['revealed'] = 'true';
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        // `.some` instead of `[entry]` destructuring: indexing is `T | undefined` under noUncheckedIndexedAccess.
        if (!entries.some((entry) => entry.isIntersecting)) return;
        el.dataset['revealed'] = 'true';
        io.disconnect();
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} {...props}>
      <style dangerouslySetInnerHTML={{ __html: REVEAL_CSS }} />
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

export default function About() {
  return (
    <RevealSection
      id="about"
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8 lg:px-12 lg:py-32"
      aria-labelledby="about-title"
    >
      <AboutBackground />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <div className="reveal">
          <SectionHeader />
        </div>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:gap-28">
          <div className="reveal" style={delay(0.08)}>
            <IdentityDossier />
          </div>

          <div className="flex flex-col justify-center">
            <div className="reveal" style={delay(0.16)}>
              <Narrative />
            </div>

            <div className="reveal mt-14" style={delay(0.25)}>
              <CapabilityGrid />
            </div>

            <div className="reveal mt-10" style={delay(0.34)}>
              <NextSection />
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function AboutBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute left-[5%] top-0 h-full w-px bg-[var(--foreground)]/[0.035]" />
      <div className="absolute right-[5%] top-0 h-full w-px bg-[var(--foreground)]/[0.035]" />
      <div className="absolute inset-0 opacity-[0.018]" style={GRID_STYLE} />
      <div className="absolute right-[5%] top-[16%] h-px w-[24%] bg-[var(--primary)]/[0.08]" />
      <div className="absolute left-[5%] top-[76%] h-px w-[18%] bg-[var(--primary)]/[0.06]" />
    </div>
  );
}

function SectionHeader() {
  return (
    <div className="mb-14 flex items-end justify-between border-b border-[var(--line)] pb-5">
      <div className="flex items-center gap-4">
        <span className={`${LABEL} text-[10px] tracking-[0.24em] text-[var(--primary)]`}>02 / Profile</span>
        <span className="hidden h-px w-14 bg-[var(--primary)] sm:block" aria-hidden="true" />
      </div>

      <span className={`${LABEL} text-[var(--muted)]`}>Dossier / 001</span>
    </div>
  );
}

function IdentityDossier() {
  return (
    <div className="mx-auto max-w-[470px] lg:mx-0">
      <div className="relative aspect-[4/5] overflow-hidden border border-[var(--line-strong)] bg-[var(--surface)]">
        <Image
          src="/images/avatar.png"
          alt="Portrait of Muhammed Basil"
          fill
          sizes="(max-width: 1024px) 90vw, 470px"
          // Colour on hover — and always on touch screens, which have no hover.
          className="object-cover grayscale transition-[transform,scale,filter] duration-700 hover:scale-[1.025] hover:grayscale-0 [@media(hover:none)]:grayscale-0 motion-reduce:transition-none motion-reduce:hover:scale-100"
        />

        <div className="pointer-events-none absolute inset-0" style={SCAN_STYLE} aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
          aria-hidden="true"
        />

        {CORNERS.map((cls) => (
          <span key={cls} className={`absolute h-7 w-7 border-[var(--primary)] ${cls}`} aria-hidden="true" />
        ))}

        <div className="absolute left-5 right-5 top-5 flex justify-between">
          <span className={`${LABEL} text-white/70`}>Identity / 001</span>
          <span className={`${LABEL} text-[var(--primary)]`}>Kerala / IN</span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <div>
            <p className={`${LABEL} text-white/70`}>Profile</p>
            <p className={`mt-1 ${DISPLAY} text-base font-bold tracking-[-0.02em] text-white`}>M. BASIL</p>
          </div>

          <span className={`border border-[var(--primary)]/50 px-2 py-1 ${LABEL} tracking-[0.18em] text-[var(--primary)]`}>
            AI / ML
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-3 border-x border-b border-[var(--line-strong)]">
        {STATS.map((stat, index) => (
          <div
            key={stat.id}
            className={`flex min-w-0 flex-col-reverse px-3 py-4 sm:px-4 ${index > 0 ? 'border-l border-[var(--line)]' : ''}`}
          >
            <dt className={`mt-1 ${LABEL} tracking-[0.12em] text-[var(--muted)]`}>{stat.label}</dt>
            <dd className={`truncate ${DISPLAY} text-[10px] font-bold tracking-tight sm:text-xs`}>{stat.value}</dd>
          </div>
        ))}
      </dl>

      <dl className="mt-5 border-y border-[var(--line)]">
        {STATUS.map(({ label, value, accent }, index) => (
          <div
            key={label}
            className={`flex items-center justify-between px-3 py-2.5 ${LABEL} tracking-[0.16em] ${
              index < STATUS.length - 1 ? 'border-b border-[var(--line)]' : ''
            }`}
          >
            <dt className="text-[var(--muted)]">{label}</dt>
            <dd className={accent ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}>{value}</dd>
          </div>
        ))}
      </dl>

      <div className={`mt-4 flex items-center justify-between ${LABEL} tracking-[0.16em] text-[var(--muted)]`}>
        <span>Subject / Developer</span>
        <span>Rev. 2026.09</span>
      </div>
    </div>
  );
}

function Narrative() {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className={`${LABEL} tracking-[0.22em] text-[var(--muted)]`}>The approach</span>
        <span className="h-px w-10 bg-[var(--line-strong)]" aria-hidden="true" />
      </div>

      {/* Sentence case in the source, uppercase in CSS: cleaner for screen readers, copy/paste and SEO. */}
      <h2
        id="about-title"
        className={`max-w-5xl ${DISPLAY} text-[clamp(1.875rem,9vw,3.75rem)] font-black uppercase leading-[0.92] tracking-[-0.065em] lg:text-[clamp(2.25rem,5.2vw,5.7rem)]`}
      >
        I build
        <br />
        <span className="text-[var(--primary)]">intelligent</span>
        <br />
        systems.
      </h2>

      <div className="mt-9 max-w-2xl border-l-2 border-[var(--primary)] pl-5 sm:pl-7">
        <p className="text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
          I&apos;m Muhammed Basil, a Computer Science undergraduate focused on web development, artificial
          intelligence, and immersive technologies.
        </p>

        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
          I enjoy working where machine learning meets practical engineering — turning models, data, and ideas into
          software that people can actually use.
        </p>
      </div>
    </div>
  );
}

function CapabilityGrid() {
  return (
    <div>
      <div className="mb-5 border-b border-[var(--line)] pb-3">
        <h3 className={`${LABEL} text-[10px] font-bold tracking-[0.22em] text-[var(--foreground)]`}>
          Capability / Stack
        </h3>
      </div>

      <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
        <Capability number="01" label="Intelligence" title="AI & ML" items={SKILLS.aiml} />
        <Capability number="02" label="Engineering" title="Technologies" items={SKILLS.technologies} />
      </div>
    </div>
  );
}

function Capability({
  number,
  label,
  title,
  items,
}: {
  number: string;
  label: string;
  title: string;
  items: readonly string[];
}) {
  return (
    <div className="group relative bg-[var(--surface)] p-6 transition-colors duration-300 hover:bg-[var(--surface-raised)]">
      {/* Accent rule draws in on hover */}
      <span
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between">
        <span className={`${DISPLAY} text-2xl font-black text-[var(--primary)]`} aria-hidden="true">
          {number}
        </span>
        <span className={`${LABEL} tracking-[0.18em] text-[var(--muted)]`}>{label}</span>
      </div>

      <h4 className={`mt-8 ${DISPLAY} text-base font-bold uppercase tracking-wide`}>{title}</h4>

      <ul className="mt-5 space-y-3">
        {items.map((skill) => (
          <li key={skill} className="flex items-center gap-3 text-sm text-[var(--muted)]">
            <span className="h-1.5 w-1.5 shrink-0 bg-[var(--primary)]" aria-hidden="true" />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NextSection() {
  return (
    <div className="flex flex-col gap-5 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className={`${LABEL} text-[var(--muted)]`}>Next / Selected work</p>
        <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
          Meaningful products, intelligent systems, and experiments built to solve something real.
        </p>
      </div>

      <a
        href="#projects"
        className={`group inline-flex w-fit shrink-0 items-center gap-4 border-b border-[var(--foreground)] pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] ${FOCUS_RING}`}
      >
        Explore work
        <span
          className="transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        >
          →
        </span>
      </a>
    </div>
  );
}