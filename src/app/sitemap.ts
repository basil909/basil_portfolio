import type { MetadataRoute } from 'next';
import { SITE_URL } from '../config/site';

// Update when page content changes; a per-build date makes the field meaningless.
const LAST_MODIFIED = new Date('2026-10-25');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/game-dev`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
