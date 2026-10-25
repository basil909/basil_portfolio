import type { CSSProperties } from 'react';

/**
 * Decorative page background.
 *
 * No hooks, no framer-motion, no 'use client': every loop is a CSS keyframe,
 * so this renders as plain HTML and ships no JavaScript of its own. (It also
 * removes the exactOptionalPropertyTypes errors that came from passing
 * `animate={undefined}` to motion components.)
 *
 * - Pauses when an ancestor has `data-inview="false"` (Hero sets this).
 * - Fully static for `prefers-reduced-motion`.
 */

/* -------------------------------------------------------------------------- */
/*  Animations                                                                */
/* -------------------------------------------------------------------------- */

const BG_CSS = `
@keyframes bgfx-drift{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(42px,26px,0) scale(1.035)}}
@keyframes bgfx-scan-y{0%,100%{transform:translateY(10%)}50%{transform:translateY(67%)}}
@keyframes bgfx-scan-x{from{transform:translateX(-20%)}to{transform:translateX(100%)}}
@keyframes bgfx-float{0%,100%{transform:translate3d(0,0,0);opacity:.06}50%{transform:translate3d(var(--x),var(--y),0);opacity:.22}}
.bgfx-orb{animation:bgfx-drift 32s ease-in-out infinite}
.bgfx-scan-y{animation:bgfx-scan-y 21s ease-in-out infinite}
.bgfx-scan-x{animation:bgfx-scan-x 38s linear infinite}
.bgfx-float{animation:bgfx-float var(--d) ease-in-out var(--dl) infinite backwards}
[data-inview="false"] .bgfx{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.bgfx{animation:none}.bgfx-scan{display:none}}
`;

const BG_STYLE = <style dangerouslySetInnerHTML={{ __html: BG_CSS }} />;

/* -------------------------------------------------------------------------- */
/*  Static data & styles (module-level: built once)                           */
/* -------------------------------------------------------------------------- */

const GRID_LINES =
  'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)';

const gridStyle = (size: number, mask: string): CSSProperties => ({
  backgroundImage: GRID_LINES,
  backgroundSize: `${size}px ${size}px`,
  maskImage: mask,
  WebkitMaskImage: mask,
});

const FINE_GRID = gridStyle(64, 'linear-gradient(to bottom, black 0%, black 58%, transparent 94%)');
const COARSE_GRID = gridStyle(320, 'radial-gradient(ellipse at center, black 0%, transparent 78%)');

const ORB_STYLE: CSSProperties = {
  background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
};
const FOCUS_STYLE: CSSProperties = {
  background: 'radial-gradient(circle, var(--primary) 0%, transparent 62%)',
};
const VIGNETTE_STYLE: CSSProperties = {
  background: 'radial-gradient(ellipse at center, transparent 45%, var(--background) 125%)',
};

type MarkerData = {
  left: string;
  top: string;
  label: string;
  side: 'left' | 'right';
  caption?: string;
};

const MARKERS: readonly MarkerData[] = [
  { left: '6%', top: '18%', label: '01', side: 'right', caption: 'system' },
  { left: '93%', top: '24%', label: '02', side: 'left' },
  { left: '10%', top: '61%', label: '03', side: 'right' },
  { left: '88%', top: '74%', label: '04', side: 'left' },
];

const PARTICLE_DATA = [
  { left: '12%', top: '28%', size: 2, x: 26, y: -20, duration: 18, delay: 0 },
  { left: '29%', top: '71%', size: 1.5, x: -20, y: -25, duration: 23, delay: 2 },
  { left: '47%', top: '19%', size: 2, x: 18, y: -24, duration: 21, delay: 4 },
  { left: '64%', top: '65%', size: 1.5, x: -24, y: -17, duration: 25, delay: 1 },
  { left: '79%', top: '37%', size: 2, x: 20, y: -22, duration: 19, delay: 3 },
  { left: '54%', top: '83%', size: 1, x: -12, y: -18, duration: 27, delay: 5 },
] as const;

// Per-particle motion is passed to the keyframes through CSS variables.
const PARTICLES = PARTICLE_DATA.map(({ left, top, size, x, y, duration, delay }) => ({
  key: `${left}-${top}`,
  style: {
    left,
    top,
    width: size,
    height: size,
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--d': `${duration}s`,
    '--dl': `${delay}s`,
  } as CSSProperties,
}));

// Full class strings so Tailwind can detect them at build time.
const AXIS_TICKS = [
  'left-[13%] h-3 bg-[var(--primary)]/[0.18]',
  'left-[25%] h-2 bg-[var(--primary)]/[0.12]',
  'left-[50%] h-4 -translate-x-1/2 bg-[var(--primary)]/[0.24]',
  'left-[75%] h-2 bg-[var(--primary)]/[0.12]',
  'right-[13%] h-3 bg-[var(--primary)]/[0.18]',
] as const;

const CORNERS = [
  { box: 'left-[5%] top-[18%]', anchor: 'left-0 top-0', opacity: 'opacity-50' },
  { box: 'right-[5%] top-[18%]', anchor: 'right-0 top-0', opacity: 'opacity-50' },
  { box: 'left-[5%] bottom-[12%]', anchor: 'bottom-0 left-0', opacity: 'opacity-40' },
  { box: 'right-[5%] bottom-[12%]', anchor: 'bottom-0 right-0', opacity: 'opacity-40' },
] as const;

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                               */
/* -------------------------------------------------------------------------- */

function Marker({ left, top, label, side, caption }: MarkerData) {
  const rule = <span className="h-px w-8 bg-[var(--line)] opacity-70" />;

  return (
    <div className="absolute flex items-center gap-2" style={{ left, top }}>
      {side === 'left' && rule}

      <span className="h-1.5 w-1.5 bg-[var(--primary)]/[0.5]" />

      <span className="font-mono text-[7px] tracking-[0.22em] text-[var(--muted-dark)] opacity-70">{label}</span>

      {side === 'right' && rule}

      {caption && (
        <span className="ml-1 font-mono text-[6px] uppercase tracking-[0.18em] text-[var(--muted-dark)] opacity-45">
          {caption}
        </span>
      )}
    </div>
  );
}

/** Everything that only shows on md+ lives under one wrapper → one display toggle. */
function DesktopDecor() {
  return (
    <div className="absolute inset-0 hidden md:block">
      {AXIS_TICKS.map((cls) => (
        <div key={cls} className={`absolute top-[38%] w-px ${cls}`} />
      ))}

      {/* Center crosshair */}
      <div className="absolute left-1/2 top-[38%] h-14 w-14 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute left-1/2 top-0 h-full w-px bg-[var(--primary)]/[0.12]" />
        <span className="absolute left-0 top-1/2 h-px w-full bg-[var(--primary)]/[0.12]" />
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-[var(--primary)]/[0.35]" />
        <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--primary)]/[0.08]" />
      </div>

      {MARKERS.map((marker) => (
        <Marker key={marker.label} {...marker} />
      ))}

      {/* Corner registration marks */}
      {CORNERS.map(({ box, anchor, opacity }) => (
        <div key={box} className={`absolute h-5 w-5 ${box}`}>
          <span className={`absolute h-px w-5 bg-[var(--line-strong)] ${anchor} ${opacity}`} />
          <span className={`absolute h-5 w-px bg-[var(--line-strong)] ${anchor} ${opacity}`} />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function BackgroundAnimation() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[var(--background)] transition-colors duration-500"
    >
      {BG_STYLE}

      {/* Technical grid — fades before it becomes visually noisy */}
      <div className="absolute inset-0 opacity-[0.028] dark:opacity-[0.042]" style={FINE_GRID} />

      {/* Larger grid for an editorial / blueprint feel */}
      <div className="absolute inset-0 opacity-[0.018]" style={COARSE_GRID} />

      {/* Page construction lines */}
      <div className="absolute inset-y-0 left-[5%] w-px bg-[var(--foreground)]/[0.045]" />
      <div className="absolute inset-y-0 right-[5%] w-px bg-[var(--foreground)]/[0.045]" />
      <div className="absolute left-0 top-[18%] h-px w-full bg-[var(--foreground)]/[0.025]" />
      <div className="absolute left-0 top-[72%] h-px w-full bg-[var(--foreground)]/[0.025]" />

      {/* Atmospheric field */}
      <div
        className="bgfx bgfx-orb absolute -left-[20vw] -top-[22vw] h-[62vw] w-[62vw] rounded-full opacity-[0.026] dark:opacity-[0.018]"
        style={ORB_STYLE}
      />

      {/* Central focus field — almost invisible, but gives the page depth */}
      <div
        className="absolute left-1/2 top-[38%] h-[46vw] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.035]"
        style={FOCUS_STYLE}
      />

      {/* Scan lines: full-size wrappers, so the % translate spans the whole page */}
      <div className="bgfx bgfx-scan bgfx-scan-y absolute inset-0">
        <span className="block h-px w-full bg-[var(--primary)]/[0.07]" />
      </div>
      <div className="bgfx bgfx-scan bgfx-scan-x absolute inset-0">
        <span className="block h-full w-px bg-[var(--primary)]/[0.045]" />
      </div>

      {/* Main system axis */}
      <div className="absolute left-1/2 top-[38%] h-px w-[74%] -translate-x-1/2 bg-[var(--primary)]/[0.085]" />

      {/* Tiny moving particles */}
      {PARTICLES.map(({ key, style }) => (
        <span
          key={key}
          className="bgfx bgfx-float absolute rounded-full bg-[var(--primary)]/[0.14] dark:bg-[var(--primary)]/[0.18]"
          style={style}
        />
      ))}

      {/* Ticks, crosshair, markers, registration marks (md+) */}
      <DesktopDecor />

      {/* Bottom depth fade */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[var(--background)] via-[var(--background)]/[0.68] to-transparent" />

      {/* Edge falloff */}
      <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-[var(--background)]/[0.32] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-[var(--background)]/[0.32] to-transparent" />

      {/* Final vignette — keeps content dominant */}
      <div className="absolute inset-0 opacity-40" style={VIGNETTE_STYLE} />
    </div>
  );
}