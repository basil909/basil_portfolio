'use client';

import { useLenis } from 'lenis/react';
import {
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_EMAIL,
} from '../config/site';

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.385.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.798 24 17.302 24 12 24 5.373 18.627 0 12 0Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path
        d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Z"
        strokeWidth="1.5"
      />
      <path d="m4 6 7.05 5.1a1.65 1.65 0 0 0 1.9 0L20 6" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M5 12 12 5l7 7M12 5v14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


export default function Footer() {
  const currentYear = new Date().getFullYear();
  const lenis = useLenis();

  // Go through Lenis when it is running; a native smooth scroll would fight it.
  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { force: true });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const iconLink =
    'flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] text-[var(--muted)] transition-colors hover:border-[var(--primary-text)] hover:text-[var(--primary-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-text)]';

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.12em]">
              Muhammed Basil
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">AI/ML developer · Kerala, India</p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {[
                ['About', '#about'],
                ['Experience', '#experience'],
                ['Projects', '#projects'],
                ['Contact', '#contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus:outline-none focus-visible:text-[var(--primary-text)]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-2">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className={iconLink}>
              <span className="h-5 w-5">
                <GithubIcon />
              </span>
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className={iconLink}>
              <span className="h-5 w-5">
                <LinkedinIcon />
              </span>
            </a>
            <a href={`mailto:${SITE_EMAIL}`} aria-label="Email" className={iconLink}>
              <span className="h-5 w-5">
                <MailIcon />
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--line)] py-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Muhammed Basil</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex w-fit items-center gap-2 font-semibold uppercase tracking-[0.12em] transition-colors hover:text-[var(--primary-text)] focus:outline-none focus-visible:text-[var(--primary-text)]"
          >
            Back to top
            <span className="h-4 w-4 transition-transform group-hover:-translate-y-0.5">
              <ArrowUpIcon />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
