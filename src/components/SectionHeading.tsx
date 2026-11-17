import type { CSSProperties, ReactNode } from 'react';

/*
 * One header for every section: label, a heading that rises out of a mask when
 * the section scrolls in (driven by RevealSection's data-revealed flag; CSS in
 * globals.css), an optional aside, and a large outlined index numeral behind
 * it as the single decorative element. Server-safe: no client JS of its own.
 */

const DISPLAY = 'font-[family-name:var(--font-orbitron)]';

export default function SectionHeading({
  index,
  label,
  id,
  lines,
  aside,
}: {
  index: string;
  label: string;
  id: string;
  /** Heading lines; each rises separately. Wrap an accent word in <Accent>. */
  lines: readonly ReactNode[];
  aside?: ReactNode;
}) {
  return (
    <header className="relative mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
      <span
        className={`section-numeral pointer-events-none absolute -top-12 right-0 select-none ${DISPLAY} text-[clamp(6rem,14vw,12rem)] font-black leading-none sm:-top-20`}
        aria-hidden="true"
      >
        {index}
      </span>

      <div className="relative">
        <p className="reveal mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--primary-text)]">
          {index} / {label}
          <span className="h-px w-14 bg-[var(--primary)]" aria-hidden="true" />
        </p>

        <h2
          id={id}
          className={`${DISPLAY} text-[clamp(2rem,8vw,3.5rem)] font-black uppercase leading-[0.98] tracking-[-0.04em] lg:text-[clamp(2.5rem,4.4vw,4.75rem)]`}
        >
          {lines.map((line, i) => (
            <span key={i} className="reveal-line" style={{ '--line-delay': `${0.06 + i * 0.09}s` } as CSSProperties}>
              <span>{line}</span>
            </span>
          ))}
        </h2>
      </div>

      {aside && (
        <div className="reveal relative max-w-sm text-sm leading-6 text-[var(--muted)] lg:text-right" style={{ '--reveal-delay': '0.2s' } as CSSProperties}>
          {aside}
        </div>
      )}
    </header>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-[var(--primary-text)]">{children}</span>;
}
