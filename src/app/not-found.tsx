import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-svh flex-col items-center justify-center bg-[var(--background)] px-6 text-center text-[var(--foreground)]"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">Error / 404</p>

      <h1 className="mt-6 font-[family-name:var(--font-orbitron)] text-[clamp(3rem,14vw,8rem)] font-black leading-none tracking-[-0.06em]">
        Lost<span className="text-[var(--primary)]">.</span>
      </h1>

      <p className="mt-6 max-w-md text-base leading-7 text-[var(--muted)]">
        That page doesn&apos;t exist. It may have moved, or the link may be wrong.
      </p>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-4 border border-[var(--primary)] px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        Back to home
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
