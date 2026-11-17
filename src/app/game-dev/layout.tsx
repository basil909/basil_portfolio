import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Rajdhani } from 'next/font/google';

// Only this page uses Rajdhani, so it is loaded here instead of site-wide.
const rajdhani = Rajdhani({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rajdhani',
  weight: ['400', '500', '600', '700'],
  // Next otherwise preloads it on every page; it is only needed on this one.
  preload: false,
});

export const metadata: Metadata = {
  title: 'Game Development',
  description:
    'Game development projects and experiments by Muhammed Basil.',
  openGraph: {
    title: 'Game Development | Muhammed Basil',
    description:
      'Game development projects and experiments by Muhammed Basil.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Development | Muhammed Basil',
    description:
      'Game development projects and experiments by Muhammed Basil.',
    images: ['/og-image.png'],
  },
};

export default function GameDevLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className={rajdhani.variable}>{children}</div>;
}
