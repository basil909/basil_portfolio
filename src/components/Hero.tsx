'use client';

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode, RefObject } from 'react';

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { MotionStyle, Variants } from 'framer-motion';
import { GITHUB_URL, LINKEDIN_URL } from '../config/site';

/* ============================================================================
   Configuration
============================================================================ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TYPING = { typeSpeed: 65, deleteSpeed: 28, pause: 2100 } as const;
const NEURAL = { logInterval: 3200, tilt: 4 } as const; // tilt = max degrees per axis
const MARQUEE = { duration: 9.5, copies: 6 } as const; // duration = seconds per loop

/* ============================================================================
   CSS-driven loops
   Every infinite animation (pulses, caret, radar sweep, scan line, marquee)
   lives in CSS instead of framer-motion: zero main-thread work per frame.
   They pause when the hero is off-screen and switch off for reduced motion.
============================================================================ */

const HERO_CSS = `
@keyframes hero-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes hero-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes hero-spin{to{transform:rotate(360deg)}}
@keyframes hero-scan{from{transform:translateY(14%)}to{transform:translateY(86%)}}
@keyframes hero-beacon{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.65);opacity:.45}}
@keyframes hero-marquee{to{transform:translateX(-${100 / MARQUEE.copies}%)}}
.hero-pulse{animation:hero-pulse 2.2s ease-in-out infinite}
.hero-blink{animation:hero-blink 1.1s steps(1,end) infinite}
.hero-spin{animation:hero-spin 14s linear infinite}
.hero-scan{animation:hero-scan 8s ease-in-out infinite alternate}
.hero-beacon{animation:hero-beacon 3.4s ease-in-out infinite}
.hero-marquee{animation:hero-marquee ${MARQUEE.duration}s linear infinite}
[data-inview="false"] .hero-anim{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.hero-anim{animation:none}}
`;

// Hoisted so the element isn't rebuilt on every render.
const HERO_STYLE = <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />;

/* ============================================================================
   Motion variants (one factory instead of near-identical objects)
============================================================================ */

type VariantOpts = { x?: number; y?: number; duration?: number; delay?: number };

const makeVariant = ({ x = 0, y = 0, duration = 0.6, delay = 0 }: VariantOpts = {}): Variants => ({
  hidden: { opacity: 0, x, y },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration, delay, ease: EASE } },
});

const V = {
  fadeIn: makeVariant({ duration: 0.55 }),
  introMarker: makeVariant({ x: -14, delay: 0.05 }),
  systemLabel: makeVariant({ duration: 0.55, delay: 0.12 }),
  heroHeading: makeVariant({ duration: 0.35, delay: 0.08 }),
  roleBlock: makeVariant({ x: -8, duration: 0.65, delay: 0.3 }),
  descriptionBlock: makeVariant({ y: 12, duration: 0.65, delay: 0.38 }),
  focusStrip: makeVariant({ y: 8, delay: 0.44 }),
  ctaBlock: makeVariant({ y: 12, duration: 0.65, delay: 0.5 }),
  socialsBlock: makeVariant({ delay: 0.58 }),
  visualBlock: makeVariant({ x: 24, duration: 0.8, delay: 0.18 }),
  footerBlock: makeVariant({ duration: 0.65, delay: 0.72 }),
} as const;

/* ============================================================================
   Static data
============================================================================ */

const TYPED_TEXTS = [
  'AI & ML Engineering',
  'Full-Stack Developer',
  'Computer Science Student',
  'NLP Enthusiast',
] as const;

const SYSTEM_LOGS = [
  'forward pass · 34ms',
  'tokenizer ready',
  'embedding cache · warm',
  'inference route · active',
  'model state · stable',
] as const;

const MARQUEE_ITEMS = ['MODELS', 'APIS', 'INTERFACES', 'EXPERIMENTS'] as const;
const MARQUEE_TRACK = Array.from({ length: MARQUEE.copies }, () => MARQUEE_ITEMS).flat();
const FOCUS_ITEMS = ['Models', 'APIs', 'Interfaces', 'Experiments'] as const;
const FOOTER_ITEMS = ['Machine learning', 'Software engineering', 'Digital systems'] as const;

const STATS = [
  { label: 'Focus', value: 'AI / ML', live: false },
  { label: 'Stack', value: 'Full Stack', live: false },
  { label: 'State', value: 'Building', live: true },
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
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774.792 0 1.771 0h20.454z',
  },
] as const;

type NeuralNode = { x: number; y: number; size: number; label: string; kind: 'input' | 'core' | 'output' };

const NODES: readonly NeuralNode[] = [
  { x: 15, y: 22, size: 4, label: 'TEXT', kind: 'input' },
  { x: 16, y: 51, size: 4, label: 'DATA', kind: 'input' },
  { x: 22, y: 78, size: 4, label: 'IMAGE', kind: 'input' },
  { x: 50, y: 50, size: 8, label: 'MODEL', kind: 'core' },
  { x: 78, y: 23, size: 4, label: 'NLP', kind: 'output' },
  { x: 84, y: 50, size: 4, label: 'PREDICT', kind: 'output' },
  { x: 76, y: 78, size: 4, label: 'SYSTEM', kind: 'output' },
];

const LINKS: readonly (readonly [number, number])[] = [
  [0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6],
  [0, 1], [1, 2], [4, 5], [5, 6],
];

/* ============================================================================
   Style tokens
   Labels never go below 9px; `font-[family-name:…]` is explicit so Tailwind
   can't mistake the font variable for a font-weight.
============================================================================ */

const DISPLAY = 'font-[family-name:var(--font-orbitron)]';
const LABEL_MD = 'font-mono text-[10px] uppercase tracking-[0.22em]';
const LABEL_SM = 'font-mono text-[9px] uppercase tracking-[0.2em]';

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]';

const CTA_BASE = `font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`;

const GRID_FINE =
  'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)';
const GRID_COARSE =
  'linear-gradient(to right, var(--line-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--line-strong) 1px, transparent 1px)';
const GLOW_BG = 'radial-gradient(circle, var(--primary) 0%, transparent 65%)';

const CORNERS = [
  'left-1.5 top-1.5 border-l border-t',
  'right-1.5 top-1.5 border-r border-t',
  'bottom-1.5 left-1.5 border-b border-l',
  'bottom-1.5 right-1.5 border-b border-r',
] as const;

const IO_COLUMNS = [
  { label: 'Input', value: 'DATA', accent: false, cls: '' },
  { label: 'Core', value: 'MODEL', accent: true, cls: 'border-x border-[var(--line)] pl-3 sm:pl-5' },
  { label: 'Output', value: 'SYSTEM', accent: false, cls: 'pl-3 sm:pl-5' },
] as const;

/* ============================================================================
   Shared hero motion context
   Hero content is visible in the server-rendered HTML; motion is reserved for
   decorative and interactive elements.
============================================================================ */

type BlockTag = 'div' | 'p' | 'h1';

function Block({
  variants,
  className,
  as = 'div',
  id,
  children,
}: {
  variants: Variants;
  className?: string;
  as?: BlockTag;
  id?: string;
  children: ReactNode;
}) {
  const Tag = m[as] as typeof m.div;

  return (
    <Tag
      id={id}
      variants={variants}
      initial={false}
      animate="visible"
      className={className}
    >
      {children}
    </Tag>
  );
}

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
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentText = texts[textIndex] ?? '';

  useEffect(() => {
    if (!currentText) return undefined;

    if (reducedMotion) {
      setDisplayText(currentText);
      return undefined;
    }
    if (!active) return undefined;

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
    <span className="inline-flex min-w-0 items-center whitespace-nowrap text-[var(--primary)]">
      {displayText}
      {!reducedMotion && (
        <span
          className="hero-anim hero-blink ml-2 inline-block h-[1.05em] w-px bg-[var(--primary)]"
          aria-hidden="true"
        />
      )}
    </span>
  );
});

/* ============================================================================
   Neural graph — static SVG; packets and rings use native SVG animation and
   are paused (not just hidden) when the hero scrolls out of view.
============================================================================ */

const NeuralGraph = memo(function NeuralGraph({ animated, paused }: { animated: boolean; paused: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !animated) return;
    if (paused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [animated, paused]);

  return (
    <svg ref={svgRef} viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true">
      {LINKS.map(([a, b], i) => {
        const from = NODES[a];
        const to = NODES[b];
        if (!from || !to) return null;
        const begin = `${(i * 0.45).toFixed(2)}s`;

        return (
          <g key={`${a}-${b}`}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="currentColor"
              className="text-[var(--line-strong)]"
              strokeWidth="0.32"
            />
            {animated && (
              <circle r="0.8" fill="var(--primary)" opacity="0">
                <animateMotion
                  dur="2.8s"
                  begin={begin}
                  repeatCount="indefinite"
                  path={`M${from.x} ${from.y} L${to.x} ${to.y}`}
                />
                <animate attributeName="opacity" values="0;0.75;0" dur="2.8s" begin={begin} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}

      {NODES.map((node, i) => {
        const isCore = node.kind === 'core';
        const ringDur = isCore ? '6s' : '8s';
        const ringBegin = `${(i * 0.25).toFixed(2)}s`;

        return (
          <g key={node.label}>
            {animated && (
              <circle
                cx={node.x}
                cy={node.y}
                r={isCore ? 13 : 7}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="0.22"
                strokeDasharray={isCore ? '2 2' : '1 3'}
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${node.x} ${node.y}`}
                  to={`360 ${node.x} ${node.y}`}
                  dur={ringDur}
                  begin={ringBegin}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values={isCore ? '0.18;0.5;0.18' : '0.08;0.28;0.08'}
                  dur={ringDur}
                  begin={ringBegin}
                  repeatCount="indefinite"
                />
              </circle>
            )}

            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill={isCore ? 'var(--primary)' : 'var(--surface)'}
              stroke="var(--primary)"
              strokeWidth={isCore ? 0.7 : 0.45}
            />

            <text
              x={node.x}
              y={node.y + (isCore ? 17 : 11)}
              textAnchor="middle"
              className="fill-[var(--muted)]"
              style={{ fontSize: isCore ? '3px' : '2.4px', fontFamily: 'monospace', letterSpacing: '0.08px' }}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
});

/* ============================================================================
   Neural visual
   Pointer is normalised to -1…1. The glow is a static gradient that moves by
   transform (compositor only) instead of re-painting a changing background.
============================================================================ */

const EMPTY_MOTION_STYLE: MotionStyle = {};
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const pad3 = (n: number) => String(n).padStart(3, '0');
const SPRING = { stiffness: 180, damping: 28, mass: 0.25 };

const NeuralVisual = memo(function NeuralVisual({
  reducedMotion,
  active,
}: {
  reducedMotion: boolean;
  active: boolean;
}) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const coordX = useMotionValue(50);
  const coordY = useMotionValue(50);

  const rotateY = useSpring(useTransform(px, [-1, 1], [-NEURAL.tilt, NEURAL.tilt]), SPRING);
  const rotateX = useSpring(useTransform(py, [-1, 1], [NEURAL.tilt, -NEURAL.tilt]), SPRING);
  const glowX = useTransform(px, [-1, 1], ['-18%', '18%']);
  const glowY = useTransform(py, [-1, 1], ['-18%', '18%']);

  const xText = useTransform(coordX, pad3);
  const yText = useTransform(coordY, pad3);
  const coordinateText = useMotionTemplate`X ${xText} / Y ${yText}`;

  const [interacting, setInteracting] = useState(false);
  const [logIndex, setLogIndex] = useState(0);

  // Rotating log line — stops while off-screen or in a hidden tab.
  useEffect(() => {
    if (reducedMotion || !active) return undefined;
    const id = window.setInterval(() => {
      if (!document.hidden) setLogIndex((i) => (i + 1) % SYSTEM_LOGS.length);
    }, NEURAL.logInterval);
    return () => window.clearInterval(id);
  }, [reducedMotion, active]);

  // Pointer input is coalesced to one layout read + write per frame.
  const frameRef = useRef(0);
  const lastEvent = useRef<{ x: number; y: number; el: HTMLElement } | null>(null);

  const flush = useCallback(() => {
    frameRef.current = 0;
    const last = lastEvent.current;
    if (!last) return;

    const rect = last.el.getBoundingClientRect();
    const nx = clamp01((last.x - rect.left) / rect.width);
    const ny = clamp01((last.y - rect.top) / rect.height);

    coordX.set(Math.round(nx * 100));
    coordY.set(Math.round(ny * 100));
    px.set(nx * 2 - 1);
    py.set(ny * 2 - 1);
  }, [coordX, coordY, px, py]);

  useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const handlePointerEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!reducedMotion && e.pointerType === 'mouse') setInteracting(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType !== 'mouse') return;
    lastEvent.current = { x: e.clientX, y: e.clientY, el: e.currentTarget };
    if (!frameRef.current) frameRef.current = requestAnimationFrame(flush);
  };

  const resetPointer = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    lastEvent.current = null;
    px.set(0);
    py.set(0);
    coordX.set(50);
    coordY.set(50);
    setInteracting(false);
  };

  return (
    <div
      className="relative [perspective:1200px]"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      role="img"
      aria-label="Abstract diagram of an AI system: data flows into a model core and out to language, prediction and system outputs"
      data-cursor-target
    >
      <m.div
        className={`relative aspect-[0.86] w-full overflow-hidden ${interacting ? '[will-change:transform]' : ''}`}
        style={reducedMotion ? EMPTY_MOTION_STYLE : { rotateX, rotateY }}
      >
        <div className="absolute inset-0 bg-[var(--surface)]" />

        {!reducedMotion && (
          <m.div
            className="pointer-events-none absolute inset-[15%] opacity-[0.1]"
            style={{ background: GLOW_BG, x: glowX, y: glowY }}
            aria-hidden="true"
          />
        )}

        <div
          className="absolute inset-0 opacity-35"
          style={{ backgroundImage: GRID_FINE, backgroundSize: '38px 38px' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: GRID_COARSE, backgroundSize: '190px 190px' }}
          aria-hidden="true"
        />

        {!reducedMotion && (
          <>
            {/* Radar sweep: pivots on the centre of the visual */}
            <div
              className="hero-anim hero-spin pointer-events-none absolute bottom-1/2 left-1/2 h-[72%] w-px origin-bottom bg-gradient-to-t from-[var(--primary)] to-transparent opacity-[0.28]"
              aria-hidden="true"
            />
            {/* Scan line: full-size wrapper so the % translate spans the whole visual */}
            <div className="hero-anim hero-scan pointer-events-none absolute inset-0" aria-hidden="true">
              <span className="block h-px w-full bg-[var(--primary)] opacity-[0.14]" />
            </div>
          </>
        )}

        <div className="absolute inset-3 border border-[var(--line-strong)] sm:inset-6" />
        <div className="absolute inset-8 border border-[var(--line)] sm:inset-12" />

        <div className="absolute left-6 right-6 top-6 z-20 flex items-center justify-between border-b border-[var(--line)] pb-3 sm:left-10 sm:right-10 sm:top-9">
          <span className={`${LABEL_SM} text-[var(--muted)]`}>Neural architecture / 001</span>
          <span className={`flex items-center gap-2 ${LABEL_SM} text-[var(--primary)]`}>
            <span className="hero-anim hero-pulse h-1.5 w-1.5 bg-[var(--primary)]" />
            Live system
          </span>
        </div>

        <div className="absolute inset-[14%]">
          <NeuralGraph animated={!reducedMotion} paused={!active} />
        </div>

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className={`block ${LABEL_SM} text-[var(--foreground)]`}>inference</span>
          <span className={`mt-1 block ${DISPLAY} text-xs font-black tracking-[-0.04em] text-[var(--foreground)]`}>
            CORE
          </span>
        </div>

        <div className="absolute left-5 top-1/2 z-20 -translate-y-1/2 sm:left-9">
          <span className={`${LABEL_SM} text-[var(--muted)] [writing-mode:vertical-rl]`}>
            Input → inference → output
          </span>
        </div>
        <div className="absolute right-5 top-1/2 z-20 -translate-y-1/2 sm:right-9">
          <span className={`${LABEL_SM} text-[var(--muted)] [writing-mode:vertical-rl]`}>Model state / active</span>
        </div>

        <div className="absolute bottom-[14%] left-1/2 z-20 w-[62%] -translate-x-1/2 border-t border-[var(--line)] pt-2 sm:w-[54%]">
          <div className={`flex items-center justify-between gap-3 ${LABEL_SM} text-[var(--muted)]`}>
            <span className="shrink-0 text-[var(--primary)]">SYS_LOG</span>
            <span className="min-w-0 flex-1 truncate text-right">
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={logIndex}
                  className="inline-block max-w-full truncate"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  {SYSTEM_LOGS[logIndex]}
                </m.span>
              </AnimatePresence>
            </span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-20 grid grid-cols-3 border-t border-[var(--line)] pt-4 sm:left-10 sm:right-10">
          {IO_COLUMNS.map(({ label, value, accent, cls }) => (
            <div key={label} className={cls}>
              <p className={`${LABEL_SM} text-[var(--muted)]`}>{label}</p>
              <p className={`mt-1 font-mono text-[10px] ${accent ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {CORNERS.map((cls) => (
          <span key={cls} className={`absolute h-5 w-5 border-[var(--primary)] ${cls}`} />
        ))}

        <m.span
          className={`absolute bottom-3 left-4 ${LABEL_SM} text-[var(--muted-dark)] sm:left-7`}
          style={{ whiteSpace: 'pre' }}
        >
          {coordinateText}
        </m.span>
      </m.div>

      <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3">
        <span className={`${LABEL_SM} text-[var(--muted)]`}>Interactive model / 01</span>
        <span className={`${LABEL_SM} text-[var(--muted)]`}>{reducedMotion ? 'Static mode' : 'Move pointer'}</span>
      </div>
    </div>
  );
});

/* ============================================================================
   Marquee — pure CSS loop; enough copies to cover wide screens, per-item
   padding (not `gap`) so the loop point is seamless.
============================================================================ */

const Marquee = memo(function Marquee({ reducedMotion }: { reducedMotion: boolean }) {
  const items = reducedMotion ? MARQUEE_ITEMS : MARQUEE_TRACK;

  return (
    <div className="overflow-hidden border-y border-[var(--line)] py-3" aria-hidden="true">
      <div
        className={`flex w-max items-center whitespace-nowrap ${LABEL_SM} tracking-[0.28em] text-[var(--muted)] ${
          reducedMotion ? '' : 'hero-anim hero-marquee'
        }`}
      >
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-5 pr-5">
            <span>{item}</span>
            <span className="text-[var(--primary)]">/</span>
          </span>
        ))}
      </div>
    </div>
  );
});

/* ============================================================================
   Reveal (masked slide-up for headline lines)
============================================================================ */

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden leading-[0.92] ${className}`}>
      <span className="block pb-[0.14em]">{children}</span>
    </span>
  );
}

/* ============================================================================
   Hero
============================================================================ */

export default function Hero() {
  const reducedMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  const active = inView; // drives every JS timer / SMIL loop

  // A 1px bar doesn't benefit from spring smoothing, so it tracks scroll directly.
  const { scrollYProgress } = useScroll();

  return (
    <LazyMotion features={domAnimation} strict>
        {HERO_STYLE}

        <section
          ref={sectionRef}
          id="home"
          data-inview={inView}
          className="relative overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
          aria-labelledby="hero-title"
        >
          <m.div
            className="fixed left-0 top-0 z-[100] h-px w-full origin-left bg-[var(--primary)]"
            style={{ scaleX: scrollYProgress }}
            aria-hidden="true"
          />

          {/* Background guides */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-[5%] top-0 h-full w-px bg-[var(--line)]" />
            <div className="absolute right-[5%] top-0 h-full w-px bg-[var(--line)]" />
            <div className="absolute left-0 top-[72%] h-px w-full bg-[var(--line)]" />
            <div className="absolute left-[5%] top-[72%] h-2 w-2 -translate-x-1/2 -translate-y-1/2">
              <span className="hero-anim hero-beacon block h-full w-full bg-[var(--primary)]" />
            </div>
            <div className="absolute bottom-0 left-[5%] top-0 w-[30vw] max-w-[520px] bg-[var(--primary)]/[0.014]" />
          </div>

          {/* min-h-svh lives here so the marquee + footer sit at the bottom on tall screens */}
          <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1600px] flex-col px-5 pb-6 pt-20 sm:px-8 lg:px-12 lg:pt-24">
            {/* Top bar */}
            <Block variants={V.fadeIn} className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-4">
                <span className={`${DISPLAY} text-sm font-black tracking-[-0.05em]`}>
                  MB<span className="text-[var(--primary)]">/</span>
                </span>
                <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
                <span className={`hidden ${LABEL_MD} text-[var(--muted)] sm:block`}>AI / Software / Systems</span>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <span className={`${LABEL_SM} text-[var(--muted)]`}>Portfolio 2026</span>
                <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
                <span className={`flex items-center gap-2 ${LABEL_SM} text-[var(--primary)]`}>
                  <span className="hero-anim hero-pulse h-1.5 w-1.5 bg-[var(--primary)]" />
                  Available
                </span>
              </div>
            </Block>

            <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:gap-14 lg:py-12 xl:gap-20">
              {/* Left column */}
              <div className="relative">
                <Block variants={V.introMarker} className="mb-7 flex items-center gap-4">
                  <span className={`${LABEL_MD} text-[var(--primary)]`}>01 / Introduction</span>
                  <span className="h-px w-16 bg-[var(--primary)]" />
                </Block>

                <Block variants={V.systemLabel} className={`mb-4 flex items-center gap-3 ${LABEL_SM} text-[var(--muted)]`}>
                  <span className="text-[var(--primary)]">SYS_01</span>
                  <span>/</span>
                  <span>Intelligence + engineering</span>
                  <span className="hidden sm:inline">/</span>
                  <span className="hidden sm:inline">Online</span>
                </Block>

                <Block
                  as="h1"
                  id="hero-title"
                  variants={V.heroHeading}
                  className={`relative z-20 ${DISPLAY} text-[clamp(2.5rem,12vw,5.5rem)] font-black leading-[0.8] tracking-[-0.085em] lg:text-[clamp(3.5rem,6.9vw,8.2rem)]`}
                >
                  <Reveal className="max-w-full">
                    <span className="block">MUHAMMED</span>
                  </Reveal>

                  <Reveal>
                    <span className="relative block pl-[0.055em]">
                      BASIL
                      <span className="text-[var(--primary)]">.</span>
                      <span className="ml-[0.12em] align-baseline font-mono text-[0.26em] font-bold tracking-[0.02em] text-[var(--primary)]">
                        C.P.
                      </span>
                      <span className="absolute bottom-[0.18em] right-[0.02em] hidden translate-x-full font-mono text-[10px] font-normal tracking-[0.2em] text-[var(--muted)] xl:block">
                        ENGINEER / BUILDER
                      </span>
                    </span>
                  </Reveal>
                </Block>

                <Block variants={V.roleBlock} className="mt-8 flex min-h-10 items-center border-l-2 border-[var(--primary)] pl-5">
                  <span className="sr-only">Roles: {TYPED_TEXTS.join(', ')}</span>
                  <span aria-hidden="true" className={`mr-4 ${LABEL_SM} text-[var(--muted)]`}>
                    I am
                  </span>
                  <span aria-hidden="true" className="min-w-0 text-lg font-medium leading-none sm:text-2xl md:text-3xl">
                    <TypedText texts={TYPED_TEXTS} reducedMotion={reducedMotion} active={active} />
                  </span>
                </Block>

                <Block
                  as="p"
                  variants={V.descriptionBlock}
                  className="mt-7 max-w-2xl text-base leading-7 text-[var(--muted)] [text-wrap:pretty] sm:text-lg sm:leading-8"
                >
                  I build intelligent systems and software experiences where machine learning meets practical
                  engineering.
                </Block>

                <Block
                  variants={V.focusStrip}
                  className={`mt-6 flex max-w-xl flex-wrap items-center gap-x-3 gap-y-1 border-y border-[var(--line)] py-3 ${LABEL_SM} text-[var(--muted)]`}
                >
                  <span className="h-1.5 w-1.5 shrink-0 bg-[var(--primary)]" />
                  {FOCUS_ITEMS.map((item, i) => (
                    <span key={item} className="contents">
                      {i > 0 && <span className="text-[var(--line-strong)]">/</span>}
                      <span>{item}</span>
                    </span>
                  ))}
                </Block>

                <Block variants={V.ctaBlock} className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#projects"
                    className={`group relative isolate inline-flex items-center gap-6 overflow-hidden bg-[var(--primary)] px-6 py-4 text-[var(--background)] ${CTA_BASE}`}
                  >
                    <span
                      className="absolute inset-y-0 left-0 z-0 w-0 bg-[var(--paper)] transition-[width] duration-500 ease-[var(--ease-out)] group-hover:w-full"
                      aria-hidden="true"
                    />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--ink)]">
                      View selected work
                    </span>
                    <span
                      className="relative z-10 transition-[transform,color] duration-300 group-hover:translate-x-2 group-hover:text-[var(--ink)]"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>

                  <a
                    href="#contact"
                    className={`inline-flex items-center border border-[var(--line-strong)] px-6 py-4 text-[var(--foreground)] hover:border-[var(--primary)] ${CTA_BASE}`}
                  >
                    Start a conversation
                  </a>
                </Block>

                <Block variants={V.socialsBlock} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2">
                  <span className={`${LABEL_SM} text-[var(--muted)]`}>Connect</span>
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit my ${social.name} profile (opens in a new tab)`}
                      className={`inline-flex items-center gap-2 py-2 ${LABEL_MD} text-[var(--foreground)] transition-colors hover:text-[var(--primary)] ${FOCUS_RING}`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={social.path} />
                      </svg>
                      {social.name}
                    </a>
                  ))}
                </Block>
              </div>

              {/* Right column */}
              <Block variants={V.visualBlock} className="relative w-full lg:ml-auto lg:max-w-[600px]">
                <NeuralVisual reducedMotion={reducedMotion} active={active} />

                <div className="mt-4 grid grid-cols-3 gap-px border border-[var(--line)] bg-[var(--line)]">
                  {STATS.map(({ label, value, live }) => (
                    <div key={label} className="bg-[var(--background)] p-3">
                      <span className={`block ${LABEL_SM} text-[var(--muted)]`}>{label}</span>
                      <span className="mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                        {live && <span className="h-1.5 w-1.5 bg-[var(--primary)]" />}
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Block>
            </div>

            <Marquee reducedMotion={reducedMotion} />

            <Block variants={V.footerBlock} className="flex items-end justify-between gap-6 border-t border-[var(--line)] pt-4">
              <a
                href="#about"
                className={`group flex items-center gap-3 ${LABEL_MD} text-[var(--muted)] transition-colors hover:text-[var(--primary)] ${FOCUS_RING}`}
              >
                <span className="relative flex h-7 w-4 items-start justify-center overflow-hidden" aria-hidden="true">
                  <span className="h-8 w-px bg-[var(--primary)] transition-transform duration-300 group-hover:translate-y-1" />
                </span>
                Scroll to explore
              </a>

              <div className={`hidden text-center ${LABEL_SM} text-[var(--muted)] sm:block`}>
                {FOOTER_ITEMS.map((item, i) => (
                  <span key={item}>
                    {i > 0 && <span className="mx-3 text-[var(--primary)]">/</span>}
                    {item}
                  </span>
                ))}
              </div>
            </Block>
          </div>
        </section>
    </LazyMotion>
  );
}