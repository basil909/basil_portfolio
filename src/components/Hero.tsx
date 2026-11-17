'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

import { GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '../config/site';
import { useMotionReduced } from '../hooks/useMotionReduced';
import AttentionMap from './AttentionMap';

/* ============================================================================
   Configuration
============================================================================ */

const TYPING = { typeSpeed: 65, deleteSpeed: 28, pause: 2100 } as const;

/* Entrance (name rises out of a mask, the rest fades up) and the caret blink.
   Pure CSS; the caret pauses off-screen. */
const HERO_CSS = `
@keyframes hero-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes hero-rise{from{transform:translateY(105%)}}
@keyframes hero-fade{from{opacity:0;transform:translateY(14px)}}
.hero-blink{animation:hero-blink 1.1s steps(1,end) infinite}
.hero-line{display:block;overflow:hidden;padding-bottom:.06em}
.hero-line>span{display:block;animation:hero-rise .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
.hero-in{animation:hero-fade .8s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@media (prefers-reduced-motion:reduce){.hero-line>span,.hero-in{animation:none}}
[data-inview="false"] .hero-anim{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.hero-anim{animation:none}}
`;

// Hoisted so the element isn't rebuilt on every render.
const HERO_STYLE = <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />;

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

/* ============================================================================
   Static data
============================================================================ */

const TYPED_TEXTS = [
  'AI & ML Engineering',
  'Full-Stack Developer',
  'Computer Science Graduate',
  'NLP Enthusiast',
] as const;

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    href: GITHUB_URL,
    path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
  {
    name: 'LinkedIn',
    href: LINKEDIN_URL,
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
] as const;

/* ============================================================================
   Style tokens
============================================================================ */

const DISPLAY = 'font-[family-name:var(--font-orbitron)]';
const LABEL = 'font-mono text-[11px] uppercase tracking-[0.22em]';

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]';

const CTA_BASE = `inline-flex items-center gap-3 px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`;


/* ============================================================================
   Hooks
============================================================================ */

/** True while the element is (nearly) in the viewport. Starts true to match SSR. */
function useInView(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // 100px margin so loops resume just before the hero scrolls back into view.
    const io = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)), {
      rootMargin: '100px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return inView;
}

/* ============================================================================
   Typed text — memoized; pauses while the hero is off-screen.
============================================================================ */

const TypedText = memo(function TypedText({
  texts,
  reducedMotion,
  active,
}: {
  texts: readonly string[];
  reducedMotion: boolean;
  active: boolean;
}) {
  const [textIndex, setTextIndex] = useState(0);
  // Start with the first role fully typed: it is in the server HTML (visible
  // without JS, no empty line on first paint) and the loop begins by pausing.
  const [displayText, setDisplayText] = useState(() => texts[0] ?? '');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentText = texts[textIndex] ?? '';

  useEffect(() => {
    if (!currentText || reducedMotion || !active) return undefined;

    let delay: number;
    let next: () => void;

    if (!isDeleting && displayText === currentText) {
      delay = TYPING.pause;
      next = () => setIsDeleting(true);
    } else if (isDeleting && displayText === '') {
      delay = TYPING.deleteSpeed;
      next = () => {
        setIsDeleting(false);
        setTextIndex((i) => (i + 1) % texts.length);
      };
    } else {
      delay = isDeleting ? TYPING.deleteSpeed : TYPING.typeSpeed;
      next = () =>
        setDisplayText(
          isDeleting ? currentText.slice(0, displayText.length - 1) : currentText.slice(0, displayText.length + 1),
        );
    }

    const id = setTimeout(next, delay);
    return () => clearTimeout(id);
  }, [active, currentText, displayText, isDeleting, reducedMotion, texts.length]);

  return (
    <span className="inline-flex min-w-0 items-center whitespace-nowrap text-[var(--primary-text)]">
      {/* Reduced motion: show the current role whole instead of typing it. */}
      {reducedMotion ? currentText : displayText}
      {!reducedMotion && (
        <span
          className="hero-anim hero-blink ml-2 inline-block h-[1.05em] w-px bg-[var(--primary-text)]"
          aria-hidden="true"
        />
      )}
    </span>
  );
});

/* ============================================================================
   Scroll progress bar — one transform write per frame, no React re-renders.
============================================================================ */

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed left-0 top-0 z-[100] h-px w-full origin-left scale-x-0 bg-[var(--primary)]"
      aria-hidden="true"
    />
  );
}

/* ============================================================================
   Hero — fits one screen: name, role, one line of intro, actions, links.
============================================================================ */

export default function Hero() {
  const reducedMotion = useMotionReduced();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  return (
    <>
      {HERO_STYLE}

      <section
        ref={sectionRef}
        id="home"
        data-inview={inView}
        className="relative overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
        aria-labelledby="hero-title"
      >
        <ScrollProgress />

        <div className="relative mx-auto grid min-h-[calc(100svh-72px)] w-full max-w-[1440px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-12 xl:gap-24">
          <div>
            <p className={`hero-in mb-8 flex items-center gap-4 ${LABEL} text-[var(--primary-text)]`} style={d(0.05)}>
              00 / Introduction
              <span className="h-px w-14 bg-[var(--primary)]" aria-hidden="true" />
            </p>

            <h1
              id="hero-title"
              className={`${DISPLAY} text-[clamp(2.6rem,11.5vw,5.5rem)] font-black leading-[0.86] tracking-[-0.045em] lg:text-[clamp(3.5rem,6.6vw,7.6rem)]`}
            >
              <span className="hero-line">
                <span style={d(0.1)}>MUHAMMED</span>
              </span>
              <span className="hero-line">
                <span style={d(0.22)}>
                BASIL
                <span className="ml-[0.4em] align-baseline text-[0.36em] tracking-[0] text-[var(--primary-text)]">
                  C.P.
                </span>
                </span>
              </span>
            </h1>

            <p style={d(0.45)} className="hero-in mt-8 flex min-h-10 items-center border-l-2 border-[var(--primary)] pl-5 text-lg font-medium leading-none sm:text-2xl md:text-3xl">
              <span className="sr-only">Roles: {TYPED_TEXTS.join(', ')}</span>
              <span aria-hidden="true">
                <TypedText texts={TYPED_TEXTS} reducedMotion={reducedMotion} active={inView} />
              </span>
            </p>

            <p style={d(0.55)} className="hero-in mt-6 max-w-xl text-base leading-7 text-[var(--muted)] [text-wrap:pretty] sm:text-lg sm:leading-8">
              I build intelligent systems and software experiences where machine learning meets practical
              engineering.
            </p>

            <div style={d(0.65)} className="hero-in mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className={`group relative isolate overflow-hidden ${CTA_BASE} bg-[var(--primary)] text-[var(--ink)]`}
              >
                {/* Light sweep on hover */}
                <span
                  className="absolute inset-y-0 -left-full -z-10 w-full bg-[var(--primary-light)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-full motion-reduce:transition-none"
                  aria-hidden="true"
                />
                View selected work
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
              <a
                href="#contact"
                className={`${CTA_BASE} border border-[var(--line-strong)] text-[var(--foreground)] hover:border-[var(--primary-text)]`}
              >
                Get in touch
              </a>
              <a
                href={RESUME_URL}
                download
                className={`ml-1 inline-flex items-center gap-2 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)] underline decoration-[var(--line-strong)] underline-offset-[6px] transition-colors hover:text-[var(--primary-text)] hover:decoration-[var(--primary-text)] ${FOCUS_RING}`}
              >
                Résumé
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div style={d(0.75)} className="hero-in mt-8 flex flex-wrap items-center gap-x-7 gap-y-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${social.name} profile (opens in a new tab)`}
                  className={`inline-flex items-center gap-2 py-2 ${LABEL} text-[var(--muted)] transition-colors hover:text-[var(--foreground)] ${FOCUS_RING}`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Hidden on small screens, where it would just push the content down. */}
          <div style={d(0.35)} className="hero-in hidden w-full max-w-[540px] justify-self-end lg:block">
            <AttentionMap active={inView} reducedMotion={reducedMotion} />
          </div>
        </div>
      </section>
    </>
  );
}
