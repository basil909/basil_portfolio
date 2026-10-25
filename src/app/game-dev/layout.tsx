import type { Metadata } from 'next';
import type { ReactNode } from 'react';

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
  return children;
}
