const DEFAULT_SITE_URL =
  process.env['NODE_ENV'] === 'production'
    ? 'https://basil-portfolio.app'
    : 'http://localhost:3000';

export const SITE_URL =
  process.env['NEXT_PUBLIC_SITE_URL'] || DEFAULT_SITE_URL;

export const AUTHOR_NAME = 'Muhammed Basil';
export const JOB_TITLE = 'AI & ML Developer';
export const SITE_EMAIL = 'basilcp090@gmail.com';
export const GITHUB_URL = 'https://github.com/basilcp909';
export const LINKEDIN_URL =
  'https://www.linkedin.com/in/muhammed-basil-cp-cse007';
