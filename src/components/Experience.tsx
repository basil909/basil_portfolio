import { RESUME_URL } from '../config/site';
import RevealSection from './RevealSection';
import TimelineRail from './TimelineRail';
import SectionHeading, { Accent } from './SectionHeading';

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const EXPERIENCE = [
  {
    role: 'Data Science Intern',
    org: 'CODO AI Innovations',
    period: 'Jul 2025 – Aug 2026',
    points: [
      'Preprocessed, cleaned and explored data with Python, Pandas and NumPy.',
      'Built and evaluated classification and prediction models with Scikit-learn, Random Forest, LightGBM and XGBoost.',
      'Worked on practical AI/NLP and data science problems, from model development to deployment.',
      'Developed interactive data science applications with Streamlit.',
    ],
  },
  {
    role: 'Intern',
    org: 'Mental Health Companion Project',
    period: 'Jan 2025 – Apr 2025',
    points: [
      'Completed a 3-month internship building the Mental Health Companion application.',
      'Optimized backend logic, fixed bugs and improved the security of API endpoints.',
      'Helped resolve technical issues and raise the overall quality of the application.',
    ],
  },
] as const;

const EDUCATION = [
  {
    school: 'Lovely Professional University, Punjab',
    detail: 'B.Tech in Computer Science & Engineering',
    period: '2021 – 2025',
  },
  {
    school: 'TSS Vadakkangara, Kerala',
    detail: 'Higher Secondary · 88%',
    period: '2018 – 2020',
  },
] as const;

const ACHIEVEMENTS = [
  'Presented the research paper “VAKYAM AI: A Reinforcement-Driven Malayalam Mastery” at AAIIC-2025 (Asian AI Innovations Conference), July 2025.',
  '4-star coder on HackerRank.',
  'Participated in a national-level NSS camp.',
] as const;

const CERTIFICATIONS = [
  { name: 'Computer Architecture and Computer Organization Masterclass', issuer: 'Udemy', date: 'May 2023' },
  { name: 'The World of Computer Networking', issuer: 'Udemy', date: 'Nov 2023' },
  { name: 'Introduction to Hardware and Operating Systems', issuer: 'Coursera', date: 'Jun 2023' },
] as const;

/* -------------------------------------------------------------------------- */
/*  Style tokens (shared with About / Hero)                                   */
/* -------------------------------------------------------------------------- */

const DISPLAY = 'font-[family-name:var(--font-orbitron)]';
const LABEL = 'font-mono text-[11px] uppercase tracking-[0.22em]';
const SUBHEAD = `${LABEL} mb-6 border-b border-[var(--line)] pb-3 font-bold text-[var(--foreground)]`;
const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]';

function Bullet() {
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--primary)]" aria-hidden="true" />;
}

/* -------------------------------------------------------------------------- */
/*  Experience & Education (server component: ships no client JavaScript)     */
/* -------------------------------------------------------------------------- */

export default function Experience() {
  return (
    <RevealSection
      id="experience"
      className="relative border-t border-[var(--line)] bg-[var(--background)] px-5 py-20 text-[var(--foreground)] sm:px-8 lg:px-12 lg:py-28"
      aria-labelledby="experience-title"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="02"
          label="Background"
          id="experience-title"
          lines={['Experience', <span key="e"><Accent>&amp;</Accent> education</span>]}
          aside={
            <a
              href={RESUME_URL}
              download
              className={`inline-flex w-fit items-center gap-2 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)] underline decoration-[var(--line-strong)] underline-offset-[6px] transition-colors hover:text-[var(--primary-text)] hover:decoration-[var(--primary-text)] ${FOCUS_RING}`}
            >
              Download résumé
              <span aria-hidden="true">↓</span>
            </a>
          }
        />

        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20">
          <div>
            <h3 className={SUBHEAD}>Work</h3>

            <TimelineRail>
              <ol className="space-y-12">
                {EXPERIENCE.map((job) => (
                  <li key={job.role + job.org} className="relative">
                    {/* Marker on the rail; lights up when the fill reaches it. */}
                    <span
                      className="timeline-dot absolute -left-9 top-1.5 h-[15px] w-[15px] border border-[var(--line-strong)] bg-[var(--background)] sm:-left-12"
                      aria-hidden="true"
                    />
                    <p className={`${LABEL} text-[var(--primary-text)]`}>{job.period}</p>
                    <h4 className={`mt-3 ${DISPLAY} text-base font-bold uppercase tracking-wide sm:text-lg`}>{job.role}</h4>
                    <p className="mt-1 text-sm font-medium text-[var(--muted)]">{job.org}</p>

                    <ul className="mt-5 space-y-3">
                      {job.points.map((point) => (
                        <li key={point} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
                          <Bullet />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </TimelineRail>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className={SUBHEAD}>Education</h3>
              <ol className="space-y-6">
                {EDUCATION.map((item) => (
                  <li key={item.school} className="border-l-2 border-[var(--primary-text)] pl-5">
                    <p className={`${LABEL} text-[var(--primary-text)]`}>{item.period}</p>
                    <h4 className="mt-2 text-base font-semibold">{item.school}</h4>
                    <p className="mt-1 text-sm text-[var(--muted)]">{item.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className={SUBHEAD}>Achievements</h3>
              <ul className="space-y-3">
                {ACHIEVEMENTS.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
                    <Bullet />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={SUBHEAD}>Certifications</h3>
              <ul className="space-y-4">
                {CERTIFICATIONS.map((cert) => (
                  <li key={cert.name} className="text-sm leading-6">
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-[var(--muted)]">
                      {cert.issuer} · {cert.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
