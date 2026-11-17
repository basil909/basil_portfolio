'use client';

import Image from 'next/image';
import RevealSection, { revealDelay } from './RevealSection';
import SectionHeading, { Accent } from './SectionHeading';

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Optional portrait. Left empty on purpose: the old 3D cartoon avatar clashed
 * with the rest of the design. Drop a real photo in public/images/ and set it
 * here, e.g. { src: '/images/portrait.webp', alt: 'Portrait of Muhammed Basil' }.
 */
const PORTRAIT: { src: string; alt: string } | null = null;

const SKILLS = [
  {
    title: 'AI & ML',
    items: ['Hugging Face Transformers', 'DeBERTaV3 / MPT-7B', 'XGBoost / Random Forest', 'Reinforcement Learning'],
  },
  {
    title: 'Technologies',
    items: ['Python / Rasa', 'FastAPI / Next.js', 'OCR / Document Processing', 'Streamlit / Jupyter'],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Style tokens                                                              */
/* -------------------------------------------------------------------------- */

const DISPLAY = 'font-[family-name:var(--font-orbitron)]';

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

export default function About() {
  return (
    <RevealSection
      id="about"
      className="relative border-t border-[var(--line)] bg-[var(--background)] px-5 py-20 text-[var(--foreground)] sm:px-8 lg:px-12 lg:py-28"
      aria-labelledby="about-title"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="01"
          label="Profile"
          id="about-title"
          lines={['I build', <Accent key="a">intelligent</Accent>, 'systems']}
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal" style={revealDelay(0.08)}>
            {PORTRAIT && (
              <div className="relative mb-10 aspect-[4/5] w-full max-w-[360px] overflow-hidden border border-[var(--line-strong)] bg-[var(--surface)]">
                <Image src={PORTRAIT.src} alt={PORTRAIT.alt} fill sizes="360px" className="object-cover" />
              </div>
            )}
            <div className="space-y-5 text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              <p>
                I&apos;m Muhammed Basil, a Computer Science graduate (B.Tech, Lovely Professional University) focused on
                web development, artificial intelligence, and immersive technologies.
              </p>
              <p>
                I enjoy working where machine learning meets practical engineering — turning models, data, and ideas
                into software that people can actually use.
              </p>
            </div>
          </div>

          <div className="reveal grid gap-px self-start border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2" style={revealDelay(0.16)}>
            {SKILLS.map((group) => (
              <div key={group.title} className="group relative bg-[var(--surface)] p-6 transition-colors duration-300 hover:bg-[var(--surface-raised)]">
                <span
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                  aria-hidden="true"
                />
                <h3 className={`${DISPLAY} text-sm font-bold uppercase tracking-wide`}>{group.title}</h3>
                <ul className="mt-5 space-y-3">
                  {group.items.map((skill) => (
                    <li key={skill} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <span className="h-1.5 w-1.5 shrink-0 bg-[var(--primary)]" aria-hidden="true" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
