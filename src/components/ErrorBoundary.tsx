'use client';

import { Component, useEffect, useRef, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/* ============================================================================
   Style tokens (same as Hero / About so the fallback matches the site)
============================================================================ */

const DISPLAY = 'font-[family-name:var(--font-orbitron)]';
const LABEL = 'font-mono text-[10px] uppercase tracking-[0.2em]';
const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]';

/* ============================================================================
   ErrorBoundary
============================================================================ */

type FallbackRender = (ctx: { error: Error; reset: () => void }) => ReactNode;

interface Props {
  children: ReactNode;
  /** A node, or a render function that receives `{ error, reset }`. */
  fallback?: ReactNode | FallbackRender;
  /** Hook for Sentry / LogRocket / your own endpoint. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Called when the user presses "Try again". */
  onReset?: () => void;
  /** Default fallback fills the screen; pass `false` when wrapping a single section. */
  fullScreen?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error | undefined;
  componentStack?: string | undefined;
}

const IS_DEV = process.env.NODE_ENV === 'development';

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
    this.props.onError?.(error, info);

    // The stack is only displayed in development, so skip the extra re-render in production.
    if (IS_DEV) this.setState({ componentStack: info.componentStack ?? undefined });
  }

  private reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: undefined, componentStack: undefined });
  };

  override render() {
    const { hasError, error, componentStack } = this.state;
    const { children, fallback, fullScreen = true } = this.props;

    if (!hasError) {
      return (
        <>
          {children}
          {/* [PERF-MONITOR] delete this line together with the section at the bottom of the file */}
          {PERF_ENABLED && <PerfMonitor />}
        </>
      );
    }

    if (typeof fallback === 'function') {
      return fallback({ error: error ?? new Error('Unknown error'), reset: this.reset });
    }
    if (fallback) return fallback;

    return (
      <DefaultFallback error={error} componentStack={componentStack} reset={this.reset} fullScreen={fullScreen} />
    );
  }
}

function DefaultFallback({
  error,
  componentStack,
  reset,
  fullScreen,
}: {
  error: Error | undefined;
  componentStack: string | undefined;
  reset: () => void;
  fullScreen: boolean;
}) {
  const Heading = fullScreen ? 'h1' : 'h2';

  return (
    <div
      role="alert"
      className={`flex items-center justify-center bg-[var(--background)] px-5 text-[var(--foreground)] ${
        fullScreen ? 'min-h-svh' : 'py-16'
      }`}
    >
      <div className="w-full max-w-lg border border-[var(--line-strong)] bg-[var(--surface)]">
        <div className={`flex items-center justify-between border-b border-[var(--line)] px-5 py-3 ${LABEL}`}>
          <span className="flex items-center gap-2 text-[var(--primary)]">
            <span className="h-1.5 w-1.5 animate-pulse bg-[var(--primary)] motion-reduce:animate-none" aria-hidden="true" />
            System fault
          </span>
          <span className="text-[var(--muted)]">ERR / 001</span>
        </div>

        <div className="p-6 sm:p-8">
          <Heading
            className={`${DISPLAY} text-2xl font-black uppercase leading-tight tracking-[-0.04em] sm:text-3xl`}
          >
            Something went wrong
          </Heading>

          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            {fullScreen ? 'The page' : 'This section'} failed to load. Try again, or reload the page if the problem
            continues.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`bg-[var(--primary)] px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--background)] transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
            >
              Reload page
            </button>

            <button
              type="button"
              onClick={reset}
              className={`border border-[var(--line-strong)] px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition-colors hover:border-[var(--primary)] ${FOCUS_RING}`}
            >
              Try again
            </button>
          </div>

          {IS_DEV && error && (
            <details className="mt-8 border-t border-[var(--line)] pt-4">
              <summary className={`cursor-pointer text-[var(--muted)] hover:text-[var(--foreground)] ${LABEL}`}>
                Error details (development only)
              </summary>
              <div className="mt-3 max-h-64 overflow-auto bg-[var(--background)] p-4 font-mono text-xs text-[var(--muted)]">
                <p className="text-[var(--foreground)]">{error.toString()}</p>
                {componentStack && <pre className="mt-3 whitespace-pre-wrap">{componentStack}</pre>}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;

/* ============================================================================
   [PERF-MONITOR] START — optional speed / statistics panel
   ----------------------------------------------------------------------------
   To remove it: delete everything from this banner to the end of the file, and
   delete the one `{PERF_ENABLED && <PerfMonitor />}` line in render() above.
   (Search the file for "PERF-MONITOR" to find both.)

   • Shown in development, and in production only when the build has
     NEXT_PUBLIC_PERF_MONITOR=1. Otherwise the bundler drops it entirely.
   • Uses only browser APIs (PerformanceObserver) — no dependencies.
   • Always test a production build (`next build && next start`) for real
     numbers; `next dev` is much slower.
============================================================================ */

const PERF_ENABLED = IS_DEV || process.env['NEXT_PUBLIC_PERF_MONITOR'] === '1';

type Rating = 'good' | 'needs-improvement' | 'poor';

// [good ≤ first, needs-improvement ≤ second, poor beyond]
const THRESHOLDS = {
  fcp: [1800, 3000],
  lcp: [2500, 4000],
  cls: [0.1, 0.25],
  inp: [200, 500],
  ttfb: [800, 1800],
  tbt: [200, 600],
} as const;

const RATING_CLASS: Record<Rating, string> = {
  good: 'text-emerald-500',
  'needs-improvement': 'text-amber-500',
  poor: 'text-red-500',
};

function rate(key: keyof typeof THRESHOLDS, value: number | undefined): Rating | undefined {
  if (value === undefined) return undefined;
  const [good, ok] = THRESHOLDS[key];
  return value <= good ? 'good' : value <= ok ? 'needs-improvement' : 'poor';
}

/* ----------------------------- statistics ---------------------------------- */

interface Stats {
  n: number;
  mean: number;
  sd: number;
  min: number;
  median: number;
  p75: number;
  p95: number;
  p99: number;
  max: number;
}

function stats(values: number[]): Stats | null {
  const n = values.length;
  if (n === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const mean = sorted.reduce((sum, v) => sum + v, 0) / n;
  const sd = Math.sqrt(sorted.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n);
  const q = (p: number) => sorted[Math.max(0, Math.ceil(p * n) - 1)] ?? 0; // nearest-rank percentile

  return {
    n,
    mean,
    sd,
    min: sorted[0] ?? 0,
    median: q(0.5),
    p75: q(0.75),
    p95: q(0.95),
    p99: q(0.99),
    max: sorted[n - 1] ?? 0,
  };
}

/** INP ≈ the 98th-percentile interaction (the worst one when there are fewer than 50). */
function estimateInp(durations: number[]): number | undefined {
  if (durations.length === 0) return undefined;
  const desc = [...durations].sort((a, b) => b - a);
  return desc[Math.min(desc.length - 1, Math.floor(desc.length / 50))];
}

/* ----------------------------- collection ---------------------------------- */

interface Vitals {
  ttfb?: number | undefined;
  fcp?: number | undefined;
  lcp?: number | undefined;
  cls: number;
  tbt: number; // blocking time of all long tasks (approximates Lighthouse TBT)
  longTasks: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface EventEntry extends PerformanceEntry {
  interactionId?: number;
}

const FRAME_BUFFER = 600;

function observe(type: string, onEntries: (entries: PerformanceEntry[]) => void, extra: object = {}) {
  try {
    const po = new PerformanceObserver((list) => onEntries(list.getEntries()));
    po.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
    return () => po.disconnect();
  } catch {
    return () => {}; // entry type not supported in this browser
  }
}

interface Snapshot {
  vitals: Vitals & { inp?: number | undefined };
  frames: { fps: number; low1: number; jank: number; sd: number; n: number } | null;
  interactions: Stats | null;
  page: {
    dom: number;
    heapMb?: number | undefined;
    requests: number;
    kb: number;
    slowest: { name: string; ms: number }[];
  };
}

function buildSnapshot(vitals: Vitals, interactions: Map<number, number>, frameTimes: number[]): Snapshot {
  const durations = [...interactions.values()];
  const ft = stats(frameTimes);
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;

  return {
    vitals: { ...vitals, inp: estimateInp(durations) },
    frames:
      ft && ft.n >= 30
        ? {
            fps: 1000 / ft.mean,
            low1: 1000 / ft.p99,
            jank: frameTimes.filter((t) => t > 33.4).length,
            sd: ft.sd,
            n: ft.n,
          }
        : null,
    interactions: stats(durations),
    page: {
      dom: document.getElementsByTagName('*').length,
      heapMb: memory ? memory.usedJSHeapSize / 1048576 : undefined,
      requests: resources.length,
      kb: resources.reduce((sum, r) => sum + r.transferSize, 0) / 1024, // 0 for cross-origin without Timing-Allow-Origin
      slowest: [...resources]
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 3)
        .map((r) => ({ name: r.name.split('?')[0]?.split('/').pop() || r.name, ms: r.duration })),
    },
  };
}

/* ------------------------------- formatting -------------------------------- */

const fmtMs = (v: number | undefined) =>
  v === undefined ? '—' : v < 1000 ? `${Math.round(v)} ms` : `${(v / 1000).toFixed(2)} s`;

/* --------------------------------- UI -------------------------------------- */

let perfOwner = false; // only one monitor at a time, even if several boundaries exist

function Row({ label, value, rating }: { label: string; value: string; rating?: Rating | undefined }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className={rating ? RATING_CLASS[rating] : 'text-[var(--foreground)]'}>{value}</dd>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--line)] px-3 py-2">
      <h3 className={`${LABEL} mb-1 text-[var(--primary)]`}>{title}</h3>
      <dl>{children}</dl>
    </section>
  );
}

function PerfMonitor() {
  const [isOwner, setIsOwner] = useState(false);
  const [open, setOpen] = useState(false);
  const [closed, setClosed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snap, setSnap] = useState<Snapshot | null>(null);

  const vitals = useRef<Vitals>({ cls: 0, tbt: 0, longTasks: 0 });
  const interactions = useRef(new Map<number, number>());
  const frames = useRef<number[]>([]);

  // 1. Elect a single owner.
  useEffect(() => {
    if (perfOwner) return undefined;
    perfOwner = true;
    setIsOwner(true);
    return () => {
      perfOwner = false;
    };
  }, []);

  // 2. Passive observers (cheap, always on).
  useEffect(() => {
    if (!isOwner) return undefined;

    const v = vitals.current;
    v.cls = 0;
    v.tbt = 0;
    v.longTasks = 0;
    interactions.current.clear();

    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav) v.ttfb = nav.responseStart;

    // CLS uses session windows: shifts <1s apart, window capped at 5s; report the worst window.
    let session = 0;
    let first = 0;
    let last = 0;

    const stops = [
      observe('paint', (entries) => {
        const fcp = entries.find((e) => e.name === 'first-contentful-paint');
        if (fcp) v.fcp = fcp.startTime;
      }),
      observe('largest-contentful-paint', (entries) => {
        const latest = entries[entries.length - 1];
        if (latest) v.lcp = latest.startTime;
      }),
      observe('layout-shift', (entries) => {
        for (const entry of entries as LayoutShiftEntry[]) {
          if (entry.hadRecentInput) continue;
          if (session > 0 && entry.startTime - last < 1000 && entry.startTime - first < 5000) {
            session += entry.value;
          } else {
            session = entry.value;
            first = entry.startTime;
          }
          last = entry.startTime;
          v.cls = Math.max(v.cls, session);
        }
      }),
      observe('longtask', (entries) => {
        for (const entry of entries) {
          v.longTasks += 1;
          v.tbt += Math.max(0, entry.duration - 50);
        }
      }),
      observe(
        'event',
        (entries) => {
          for (const entry of entries as EventEntry[]) {
            if (!entry.interactionId) continue;
            const prev = interactions.current.get(entry.interactionId) ?? 0;
            interactions.current.set(entry.interactionId, Math.max(prev, entry.duration));
          }
        },
        { durationThreshold: 40 },
      ),
    ];

    return () => stops.forEach((stop) => stop());
  }, [isOwner]);

  // 3. Frame sampling only while the panel is open (it costs a rAF per frame).
  useEffect(() => {
    if (!isOwner || !open) return undefined;

    let raf = 0;
    let prev = 0;
    const tick = (now: number) => {
      if (prev) {
        const dt = now - prev;
        if (dt < 1000) {
          // ignore gaps from hidden tabs
          const buffer = frames.current;
          buffer.push(dt);
          if (buffer.length > FRAME_BUFFER) buffer.shift();
        }
      }
      prev = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isOwner, open]);

  // 4. Refresh the displayed numbers once a second.
  useEffect(() => {
    if (!isOwner) return undefined;
    const refresh = () => {
      if (!document.hidden) setSnap(buildSnapshot(vitals.current, interactions.current, frames.current));
    };
    refresh();
    const id = window.setInterval(refresh, 1000);
    return () => window.clearInterval(id);
  }, [isOwner]);

  if (!isOwner || closed || !snap) return null;

  const { vitals: vt, frames: fr, interactions: ix, page } = snap;

  const copyReport = async () => {
    const report = {
      url: window.location.href,
      at: new Date().toISOString(),
      build: process.env.NODE_ENV,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      ...snap,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const buttonCls = `px-2 py-1 text-[var(--muted)] transition-colors hover:text-[var(--primary)] ${FOCUS_RING}`;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded="false"
        aria-label="Open performance monitor"
        className={`fixed bottom-3 right-3 z-[300] flex items-center gap-2 border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2 ${LABEL} text-[var(--foreground)] ${FOCUS_RING}`}
      >
        <span className="text-[var(--primary)]">Perf</span>
        <span className={vt.lcp !== undefined ? RATING_CLASS[rate('lcp', vt.lcp) ?? 'good'] : ''}>
          LCP {fmtMs(vt.lcp)}
        </span>
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="Performance monitor"
      className="fixed bottom-3 right-3 z-[300] max-h-[75vh] w-[320px] max-w-[calc(100vw-1.5rem)] overflow-auto border border-[var(--line-strong)] bg-[var(--surface)] font-mono text-[11px] text-[var(--foreground)] shadow-lg"
    >
      <div className={`flex items-center justify-between px-3 py-2 ${LABEL}`}>
        <span className="text-[var(--primary)]">Performance</span>
        <button type="button" onClick={() => setOpen(false)} aria-expanded="true" className={buttonCls}>
          Collapse
        </button>
      </div>

      <Group title="Core Web Vitals">
        <Row label="LCP" value={fmtMs(vt.lcp)} rating={rate('lcp', vt.lcp)} />
        <Row label="FCP" value={fmtMs(vt.fcp)} rating={rate('fcp', vt.fcp)} />
        <Row label="CLS" value={vt.cls.toFixed(3)} rating={rate('cls', vt.cls)} />
        <Row label="INP (est.)" value={fmtMs(vt.inp)} rating={rate('inp', vt.inp)} />
        <Row label="TTFB" value={fmtMs(vt.ttfb)} rating={rate('ttfb', vt.ttfb)} />
        <Row label={`Blocking (${vt.longTasks} long tasks)`} value={fmtMs(vt.tbt)} rating={rate('tbt', vt.tbt)} />
      </Group>

      <Group title="Frame rate">
        {fr ? (
          <>
            <Row label="Average" value={`${fr.fps.toFixed(0)} fps`} rating={fr.fps >= 55 ? 'good' : fr.fps >= 40 ? 'needs-improvement' : 'poor'} />
            <Row label="1% low" value={`${fr.low1.toFixed(0)} fps`} rating={fr.low1 >= 45 ? 'good' : fr.low1 >= 30 ? 'needs-improvement' : 'poor'} />
            <Row label="Frame time σ" value={`${fr.sd.toFixed(1)} ms`} />
            <Row label={`Janky frames (>33 ms)`} value={`${fr.jank} / ${fr.n}`} />
          </>
        ) : (
          <p className="py-1 text-[var(--muted)]">Sampling… keep this panel open for a few seconds.</p>
        )}
      </Group>

      <Group title="Interactions">
        {ix ? (
          <>
            <Row label="Count" value={String(ix.n)} />
            <Row label="Mean ± σ" value={`${Math.round(ix.mean)} ± ${Math.round(ix.sd)} ms`} />
            <Row label="Median / p75" value={`${Math.round(ix.median)} / ${Math.round(ix.p75)} ms`} />
            <Row label="p95 / max" value={`${Math.round(ix.p95)} / ${Math.round(ix.max)} ms`} />
          </>
        ) : (
          <p className="py-1 text-[var(--muted)]">Click or type to record interactions (≥40 ms).</p>
        )}
      </Group>

      <Group title="Page">
        <Row label="DOM nodes" value={String(page.dom)} rating={page.dom < 1500 ? 'good' : page.dom < 3000 ? 'needs-improvement' : 'poor'} />
        {page.heapMb !== undefined && <Row label="JS heap" value={`${page.heapMb.toFixed(1)} MB`} />}
        <Row label="Requests" value={String(page.requests)} />
        <Row label="Transferred" value={`${page.kb.toFixed(0)} KB`} />
        {page.slowest.map((r) => (
          <Row key={r.name} label={r.name.slice(0, 26)} value={fmtMs(r.ms)} />
        ))}
      </Group>

      <div className={`flex items-center justify-between border-t border-[var(--line)] px-2 py-1 ${LABEL}`}>
        <div>
          <button
            type="button"
            onClick={() => {
              frames.current.length = 0;
              interactions.current.clear();
              setSnap(buildSnapshot(vitals.current, interactions.current, frames.current));
            }}
            className={buttonCls}
          >
            Reset samples
          </button>
          <button type="button" onClick={copyReport} className={buttonCls}>
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
        </div>
        <button type="button" onClick={() => setClosed(true)} className={buttonCls}>
          Hide
        </button>
      </div>

      {IS_DEV && (
        <p className="border-t border-[var(--line)] px-3 py-2 text-[10px] leading-4 text-[var(--muted)]">
          Dev build: numbers are slower than production. Run `next build && next start` for real results.
        </p>
      )}
    </div>
  );
}

/* [PERF-MONITOR] END */