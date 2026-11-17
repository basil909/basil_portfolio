'use client';

import { Component } from 'react';
import dynamic from 'next/dynamic';
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

/* [PERF-MONITOR] Optional speed / statistics panel (see PerfMonitor.tsx).
   PERF_ENABLED is a build-time constant, so in normal production builds the
   dynamic import below is removed and the panel's code never ships. */
const PERF_ENABLED = IS_DEV || process.env['NEXT_PUBLIC_PERF_MONITOR'] === '1';
const PerfMonitor = PERF_ENABLED ? dynamic(() => import('./PerfMonitor'), { ssr: false }) : null;

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
          {/* [PERF-MONITOR] */}
          {PerfMonitor && <PerfMonitor />}
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
