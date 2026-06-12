import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { i18n } from '@/i18n-config';
import { getRestProjects } from '@/lib/firebase-rest';
import { defaultProjects, Project } from '@/lib/constants';

// Revalidate once a day
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;
  const lastModified = new Date().toISOString().split('T')[0];

  let projects: Project[] = defaultProjects;
  try {
    const data = await getRestProjects();
    if (data && data.length > 0) {
      projects = data;
    }
  } catch (error) {
    console.error("Sitemap failed to fetch projects", error);
  }

  const getSeoSlug = (p: Project) => {
    const catSlug = (p.category || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return catSlug ? `${p.id}-${catSlug}` : p.id;
  };

  const routes = [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/faq', priority: 0.64, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/legal', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const projectRoutes = projects.map(p => ({
    path: `/projects/${getSeoSlug(p)}`,
    priority: 0.8,
    changeFrequency: 'yearly' as const,
  }));

  const allRoutes = [...routes, ...projectRoutes];

  const sitemapEntries: MetadataRoute.Sitemap = allRoutes.flatMap(route => {
    // Generate entries for each locale
    return i18n.locales.map(locale => {
      // The default locale usually doesn't have a prefix if middleware rewrites, 
      // but in Next.js localized setups, it's safer to provide the full paths if canonicals use them.
      // Let's match whatever layout.tsx is doing. layout.tsx uses `${canonicalBase}/${locale}` for canonicals!
      const url = `${baseUrl}/${locale}${route.path}`;
      
      const languages: Record<string, string> = {};
      i18n.locales.forEach(l => {
        languages[l] = `${baseUrl}/${l}${route.path}`;
      });
      // x-default is good practice for internationalization
      languages['x-default'] = `${baseUrl}/fr${route.path}`;

      return {
        url,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages,
        },
      };
    });
  });

  return sitemapEntries;
}
