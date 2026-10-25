'use client';

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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--background)] text-[var(--foreground)]">
      {/* Subtle technical grid */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-px w-1/3 bg-[var(--primary)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12">
        {/* Top identity row */}
        <div className="mb-16 flex flex-col gap-8 border-b border-[var(--line)] pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 font-[var(--font-rajdhani)] text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Portfolio / 2026
            </p>

            <h2 className="font-[var(--font-orbitron)] text-[clamp(2.4rem,6vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.06em]">
              Build something
              <br />
              <span className="text-[var(--primary)]">intelligent.</span>
            </h2>
          </div>

          <a
            href="#contact"
            className="group inline-flex w-fit items-center gap-3 border-b border-[var(--foreground)] pb-2 text-sm font-semibold uppercase tracking-[0.16em] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            Start a conversation
            <ArrowIcon />
          </a>
        </div>

        {/* Main footer grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1fr] lg:gap-16">
          {/* About + newsletter */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="relative h-2 w-2 bg-[var(--primary)]">
                <span className="absolute -inset-1 border border-[var(--primary)]/30" />
              </span>
              <span className="font-[var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.12em]">
                Muhammed Basil
              </span>
            </div>

            <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
              AI/ML developer building practical intelligent systems,
              full-stack applications, and tools designed to solve real
              problems.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="mb-6 font-[var(--font-rajdhani)] text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Navigate
            </p>

            <ul className="space-y-4">
              {[
                ['01', 'About', '#about'],
                ['02', 'Projects', '#projects'],
                ['03', 'Contact', '#contact'],
              ].map(([number, label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.08em] transition-colors hover:text-[var(--primary)]"
                  >
                    <span className="font-[var(--font-rajdhani)] text-xs text-[var(--muted-dark)] transition-colors group-hover:text-[var(--primary)]">
                      {number}
                    </span>
                    <span>{label}</span>
                    <ArrowIcon />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <p className="mb-6 font-[var(--font-rajdhani)] text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Connect
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] text-[var(--muted)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-black"
              >
                <span className="h-5 w-5">
                  <GithubIcon />
                </span>
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] text-[var(--muted)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-black"
              >
                <span className="h-5 w-5">
                  <LinkedinIcon />
                </span>
              </a>

              <a
                href={`mailto:${SITE_EMAIL}`}
                aria-label="Email"
                className="flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] text-[var(--muted)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-black"
              >
                <span className="h-5 w-5">
                  <MailIcon />
                </span>
              </a>
            </div>

            <div className="mt-8 border-l-2 border-[var(--primary)] pl-4">
              <p className="font-[var(--font-rajdhani)] text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Based in
              </p>
              <p className="mt-1 text-sm font-medium">Kerala, India</p>
            </div>

            <p className="mt-8 max-w-xs text-xs leading-6 text-[var(--muted-dark)]">
              Open to interesting projects, collaborations, and opportunities
              involving AI, ML, and software engineering.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-5 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted-dark)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Muhammed Basil. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>Next.js / Tailwind CSS</span>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 font-semibold uppercase tracking-[0.12em] text-[var(--muted)] transition-colors hover:text-[var(--primary)]"
            >
              Back to top
              <span className="h-4 w-4 transition-transform group-hover:-translate-y-0.5">
                <ArrowUpIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
