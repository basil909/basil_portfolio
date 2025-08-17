import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhammed Basil | Portfolio",
  description: "Computer Science student specializing in AI, ML, and web development",
  keywords: "Muhammed Basil, Portfolio, Web Development, AI, ML, React, Next.js, Python",
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