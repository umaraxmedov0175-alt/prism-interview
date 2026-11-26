import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Prism: Interview',
    short_name: 'Prism',
    description: 'Practice the exact interview you are about to face.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#0B0D12',
    theme_color: '#4F46E5',
  };
}
