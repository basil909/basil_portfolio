import { RESUME_URL } from '../config/site';

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
const LABEL = 'font-mono text-[9px] uppercase tracking-[0.2em]';
const SUBHEAD = `${LABEL} mb-6 border-b border-[var(--line)] pb-3 text-[10px] font-bold tracking-[0.22em]`;
const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]';

function Bullet() {
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--primary)]" aria-hidden="true" />;
}

/* -------------------------------------------------------------------------- */
/*  Experience & Education (server component: ships no client JavaScript)     */
/* -------------------------------------------------------------------------- */

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative border-t border-[var(--line)] bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8 lg:px-12 lg:py-32"
      aria-labelledby="experience-title"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between lg:mb-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className={`${LABEL} tracking-[0.22em] text-[var(--muted)]`}>The background</span>
              <span className="h-px w-10 bg-[var(--line-strong)]" aria-hidden="true" />
            </div>

            <h2
              id="experience-title"
              className={`${DISPLAY} text-[clamp(1.875rem,8vw,3.5rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] lg:text-[clamp(2.25rem,4.6vw,5rem)]`}
            >
              Experience <span className="text-[var(--primary)]">&amp;</span>
              <br />
              education.
            </h2>
          </div>

          <a
            href={RESUME_URL}
            download
            className={`inline-flex w-fit shrink-0 items-center gap-4 border border-[var(--primary)] px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[var(--ink)] ${FOCUS_RING}`}
          >
            Download résumé
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20 xl:gap-28">
          <div>
            <h3 className={SUBHEAD}>Experience</h3>

            <ol className="space-y-px border border-[var(--line)] bg-[var(--line)]">
              {EXPERIENCE.map((job) => (
                <li key={job.role + job.org} className="bg-[var(--surface)] p-6 sm:p-8">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h4 className={`${DISPLAY} text-base font-bold uppercase tracking-wide sm:text-lg`}>{job.role}</h4>
                    <p className={`${LABEL} shrink-0 text-[var(--primary)]`}>{job.period}</p>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[var(--muted)]">{job.org}</p>

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
          </div>

          <div className="space-y-12">
            <div>
              <h3 className={SUBHEAD}>Education</h3>
              <ol className="space-y-6">
                {EDUCATION.map((item) => (
                  <li key={item.school} className="border-l-2 border-[var(--primary)] pl-5">
                    <p className={`${LABEL} text-[var(--primary)]`}>{item.period}</p>
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
    </section>
  );
}
