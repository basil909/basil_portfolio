import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/private/'],
      },
    ],
    sitemap: 'https://basil-portfolio.vercel.app/sitemap.xml',
    host: 'https://basil-portfolio.vercel.app',
  }
}
