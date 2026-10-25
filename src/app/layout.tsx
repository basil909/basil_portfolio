import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, Orbitron, Rajdhani } from 'next/font/google';

import ErrorBoundary from '../components/ErrorBoundary';
import {
  AUTHOR_NAME,
  GITHUB_URL,
  JOB_TITLE,
  LINKEDIN_URL,
  SITE_URL,
} from '../config/site';
import './globals.css';

/* =========================================================
   FONTS
========================================================= */

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
  weight: ['400', '700', '900'],
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rajdhani',
  weight: ['400', '500', '600', '700'],
});

/* =========================================================
   SITE CONFIGURATION
========================================================= */

const TITLE = `${AUTHOR_NAME} | ${JOB_TITLE}`;

const DESCRIPTION =
  'Computer Science student and AI/ML developer building intelligent systems, web applications, and experimental digital experiences.';
const TWITTER_DESCRIPTION =
  'AI/ML developer and Computer Science student building intelligent systems and digital experiences.';

const TWITTER_HANDLE = '@basilcp909';

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITLE,
    template: `%s | ${AUTHOR_NAME}`,
  },

  description: DESCRIPTION,

  keywords: [
    'Muhammed Basil',
    'AI Developer',
    'AI & ML Developer',
    'Machine Learning',
    'Artificial Intelligence',
    'Full Stack Developer',
    'Python',
    'React',
    'Next.js',
    'NLP',
    'Computer Vision',
    'Developer Portfolio',
  ],

  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME,
  applicationName: `${AUTHOR_NAME} Portfolio`,
  category: 'technology',
  referrer: 'origin-when-cross-origin',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: { canonical: '/' },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: AUTHOR_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${AUTHOR_NAME} — ${JOB_TITLE}`,
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: TWITTER_DESCRIPTION,
    images: ['/og-image.png'],
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
};

/* =========================================================
   VIEWPORT
========================================================= */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a09' },
    { media: '(prefers-color-scheme: light)', color: '#eeeae1' },
  ],
};

/* =========================================================
   THEME INITIALIZATION
   Runs synchronously in <head> before first paint (no flash).
========================================================= */

const themeScript = `(function(){try{var d=document.documentElement,s=localStorage.getItem('theme'),t=s==='dark'||s==='light'?s:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.classList.toggle('light',t==='light');d.style.colorScheme=t}catch(e){}})();`;

/* =========================================================
   STRUCTURED DATA (serialized once at module load)
========================================================= */

const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: SITE_URL,
      jobTitle: JOB_TITLE,
      description: DESCRIPTION,
      sameAs: [GITHUB_URL, LINKEDIN_URL],
      image: `${SITE_URL}/og-image.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${AUTHOR_NAME} Portfolio`,
      description: `Portfolio of ${AUTHOR_NAME}, an AI/ML developer and Computer Science student.`,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  ],
}).replace(/</g, '\\u003c'); // prevents `</script>` injection

/* =========================================================
   BODY CONFIGURATION
========================================================= */

const bodyClassName = [
  inter.variable,
  orbitron.variable,
  rajdhani.variable,
  inter.className,
  'antialiased',
].join(' ');

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body className={bodyClassName} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[300] bg-[var(--primary)] px-4 py-3 font-semibold text-[var(--ink)] focus:not-sr-only"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}