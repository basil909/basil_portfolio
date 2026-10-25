'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';

import { useTheme } from '../hooks/useTheme';

/* ============================================================================
   Navigation data (single source of truth for desktop + mobile)
   - `hash` items scroll in-page when on "/", otherwise navigate to "/#hash".
   - Numbers are derived from position, so adding a link never desyncs them.
============================================================================ */

type NavItem = { name: string; href: string; hash?: string };

const NAV_ITEMS: readonly NavItem[] = [
  { name: 'About', href: '/#about', hash: '#about' },
  { name: 'Projects', href: '/#projects', hash: '#projects' },
  { name: 'Contact', href: '/#contact', hash: '#contact' },
  { name: 'Game Dev', href: '/game-dev' },
];

const pad = (n: number) => String(n).padStart(2, '0');
const DESKTOP_QUERY = '(min-width: 768px)'; // Tailwind `md`

/* ============================================================================
   Icons
============================================================================ */

type IconProps = { className?: string };

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const SunIcon = ({ className }: IconProps) => (
  <svg {...svgProps} className={className}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.29 5.29 3.88 3.88M20.12 20.12l-1.41-1.41M18.71 5.29l1.41-1.41M3.88 20.12l1.41-1.41" />
  </svg>
);

const MoonIcon = ({ className }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M20 15.2A8.4 8.4 0 0 1 8.8 4a8.4 8.4 0 1 0 11.2 11.2Z" />
  </svg>
);

const MenuIcon = ({ open, className }: IconProps & { open: boolean }) => (
  <svg {...svgProps} className={className}>
    <path d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
  </svg>
);

const ArrowIcon = ({ className }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

/* ============================================================================
   Shared styles
============================================================================ */

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]';

const ICON_BUTTON = `flex items-center justify-center border border-[var(--line)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] ${FOCUS_RING}`;

/* ============================================================================
   Theme toggle (was duplicated for desktop / mobile)
============================================================================ */

function ThemeToggle({
  isDark,
  disabled,
  reducedMotion,
  onToggle,
  className,
}: {
  isDark: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onToggle: () => void;
  className: string;
}) {
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`${ICON_BUTTON} ${className} text-[var(--muted)] disabled:cursor-default disabled:opacity-70`}
    >
      <m.span
        key={isDark ? 'sun' : 'moon'}
        initial={reducedMotion ? false : { rotate: -45, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.2 }}
        className="h-4 w-4"
      >
        {isDark ? <SunIcon className="h-full w-full" /> : <MoonIcon className="h-full w-full" />}
      </m.span>
    </button>
  );
}

/* ============================================================================
   Navbar
============================================================================ */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const { isDark, toggleTheme, isInitialized } = useTheme();
  const reducedMotion = useReducedMotion() ?? false;

  /* ---- Scroll state (rAF-throttled; React bails out when value is unchanged) ---- */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* ---- Mobile menu: scroll lock, Escape to close, auto-close on desktop resize ---- */
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    mq.addEventListener('change', onChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  /* ---- Navigation ---- */
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleNavigate = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, item: NavItem) => {
      // Release the body scroll-lock *before* scrolling. Otherwise the
      // smooth-scroll starts while `overflow: hidden` is still applied and
      // can be ignored by some browsers.
      flushSync(() => setMenuOpen(false));

      // Only intercept in-page anchors while on the home page. On any other
      // route, let Next.js navigate to "/#section" normally.
      if (!item.hash || pathname !== '/') return;

      const target = document.querySelector(item.hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState(null, '', item.hash);
    },
    [pathname, reducedMotion],
  );

  const isCurrent = (item: NavItem) => !item.hash && pathname === item.href;

  /* ---- Render ---- */
  return (
    <LazyMotion features={domAnimation}>
      <m.header
        initial={reducedMotion ? false : { y: -80 }}
        animate={{ y: 0 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 22 }}
        className="sticky top-0 z-50"
      >
        <nav
          aria-label="Main navigation"
          className={`relative border-b border-[var(--line)] backdrop-blur-md transition-[background-color,box-shadow] duration-300 ${
            scrolled
              ? 'bg-[var(--background)]/95 shadow-[0_8px_30px_rgba(0,0,0,0.14)]'
              : 'bg-[var(--background)]/80'
          }`}
        >
          <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
            {/* Brand */}
            <Link
              href="/"
              onClick={closeMenu}
              aria-label="Muhammed Basil home"
              className={`group flex items-center gap-3 ${FOCUS_RING}`}
            >
              <span className="relative flex h-8 w-8 items-center justify-center border border-[var(--primary)] font-[var(--font-rajdhani)] text-xs font-bold text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--ink)]">
                MB
              </span>

              <span className="hidden sm:block">
                <span className="block font-[var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.08em] text-[var(--foreground)]">
                  Muhammed Basil
                </span>
                <span className="mt-0.5 block font-[var(--font-rajdhani)] text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
                  AI / ML Developer
                </span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-6 md:flex">
              <ul className="flex items-center gap-6">
                {NAV_ITEMS.map((item, i) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavigate(e, item)}
                      aria-current={isCurrent(item) ? 'page' : undefined}
                      className="group flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus:outline-none focus-visible:text-[var(--primary)]"
                    >
                      <span className="font-[var(--font-rajdhani)] text-[10px] text-[var(--muted-dark)] transition-colors group-hover:text-[var(--primary)]">
                        {pad(i + 1)}
                      </span>
                      <span className="relative py-2">
                        {item.name}
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-0 left-0 h-px bg-[var(--primary)] transition-[width] duration-300 group-hover:w-full ${
                            isCurrent(item) ? 'w-full' : 'w-0'
                          }`}
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <span className="h-5 w-px bg-[var(--line)]" aria-hidden="true" />

              <ThemeToggle
                isDark={isDark}
                disabled={!isInitialized}
                reducedMotion={reducedMotion}
                onToggle={toggleTheme}
                className="h-9 w-9"
              />
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle
                isDark={isDark}
                disabled={!isInitialized}
                reducedMotion={reducedMotion}
                onToggle={toggleTheme}
                className="h-10 w-10"
              />

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className={`${ICON_BUTTON} h-10 w-10 text-[var(--foreground)]`}
              >
                <MenuIcon open={menuOpen} className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          <AnimatePresence>
            {menuOpen && (
              <m.div
                id="mobile-navigation"
                initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.22 }}
                className="overflow-hidden border-t border-[var(--line)] bg-[var(--background)] md:hidden"
              >
                <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-[var(--font-rajdhani)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                      Navigation
                    </span>
                    <span className="font-[var(--font-rajdhani)] text-[10px] text-[var(--muted-dark)]">
                      {pad(1)} — {pad(NAV_ITEMS.length)}
                    </span>
                  </div>

                  <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
                    {NAV_ITEMS.map((item, i) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={(e) => handleNavigate(e, item)}
                          aria-current={isCurrent(item) ? 'page' : undefined}
                          className="group flex w-full items-center justify-between py-4 text-left transition-colors hover:text-[var(--primary)] focus:outline-none focus-visible:text-[var(--primary)]"
                        >
                          <span className="flex items-center gap-4">
                            <span className="font-[var(--font-rajdhani)] text-xs text-[var(--muted-dark)] group-hover:text-[var(--primary)]">
                              {pad(i + 1)}
                            </span>
                            <span className="text-base font-semibold uppercase tracking-[0.08em]">
                              {item.name}
                            </span>
                          </span>
                          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </nav>
      </m.header>
    </LazyMotion>
  );
}