import type { MetadataRoute } from 'next';
import { COMPANY_GUIDES, LEARN_GUIDES, PUBLIC_QUESTIONS } from '@/lib/content/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://prism-interview.vercel.app';
  const staticRoutes = ['', '/pricing', '/about', '/privacy', '/terms', '/contact', '/questions', '/learn'];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
    })),
    ...PUBLIC_QUESTIONS.map((q) => ({
      url: `${base}/questions/${q.slug}`,
      lastModified: new Date(),
    })),
    ...COMPANY_GUIDES.map((c) => ({
      url: `${base}/companies/${c.slug}`,
      lastModified: new Date(),
    })),
    ...LEARN_GUIDES.map((g) => ({
      url: `${base}/learn/${g.slug}`,
      lastModified: new Date(),
    })),
  ];
}
