import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/sitemap'],
      disallow: [
        '/api/',
        '/private/',
        '/*?*&*',
        '/portfolio/',
        '/wp-admin/',
        '/wp-includes/',
        '/wp-login.php',
        '/xmlrpc.php',
        '/wp-content/',
        '/wp-json/',
        '/category/',
        '/tag/',
        '/author/',
        '/feed/',
        '/comments/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
