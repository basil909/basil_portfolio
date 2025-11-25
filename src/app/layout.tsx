import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhammed Basil | AI & ML Developer Portfolio",
  description: "Computer Science student and AI/ML developer specializing in machine learning, web development, and intelligent systems. View projects in NLP, computer vision, and full-stack development.",
  keywords: [
    "Muhammed Basil",
    "AI Developer",
    "Machine Learning Engineer",
    "Full Stack Developer",
    "Portfolio",
    "React",
    "Next.js",
    "Python",
    "NLP",
    "Computer Vision",
    "Web Development"
  ],
  authors: [{ name: "Muhammed Basil" }],
  creator: "Muhammed Basil",
  publisher: "Muhammed Basil",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://basil-portfolio.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://basil-portfolio.vercel.app',
    title: 'Muhammed Basil | AI & ML Developer Portfolio',
    description: 'Computer Science student and AI/ML developer specializing in machine learning, web development, and intelligent systems.',
    siteName: 'Muhammed Basil Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Muhammed Basil - AI & ML Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammed Basil | AI & ML Developer Portfolio',
    description: 'Computer Science student and AI/ML developer specializing in machine learning, web development, and intelligent systems.',
    images: ['/og-image.jpg'],
    creator: '@basilcp909',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'portfolio',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  other: {
    'msapplication-TileColor': '#3B82F6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply theme immediately with no transitions
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
                  
                  // Prevent transitions during initial load
                  document.documentElement.classList.add('theme-switching');
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                  
                  // Mark as initialized and remove switching class
                  document.documentElement.classList.add('theme-initialized');
                  setTimeout(() => {
                    document.documentElement.classList.remove('theme-switching');
                  }, 10);
                } catch (err) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}