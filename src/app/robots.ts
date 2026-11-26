import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://prism-interview.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/questions', '/companies', '/learn', '/pricing', '/about'],
        disallow: ['/app', '/admin', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
