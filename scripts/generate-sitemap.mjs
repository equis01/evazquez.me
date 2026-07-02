import { execFileSync } from 'node:child_process';
import { existsSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE_URL = 'https://evamtz.me';
const root = resolve(import.meta.dirname, '..');

const pages = [
  { file: 'index.html', path: '/', priority: '1.0', changefreq: 'monthly' },
  { file: 'lalia/index.html', path: '/lalia/', priority: '0.9', changefreq: 'weekly' },
  { file: 'experiencia/index.html', path: '/experiencia/', priority: '0.8', changefreq: 'monthly' },
  { file: 'portafolio/index.html', path: '/portafolio/', priority: '0.9', changefreq: 'weekly' },
  { file: 'portafolio/shop/index.html', path: '/portafolio/shop/', priority: '0.7', changefreq: 'monthly' },
  { file: 'cv/index.html', path: '/cv/', priority: '0.7', changefreq: 'monthly' },
  { file: 'portafolio/herramientas/qr-gen/index.html', path: '/portafolio/herramientas/qr-gen/', priority: '0.7', changefreq: 'monthly' },
  { file: 'portafolio/proyectos/chula/index.html', path: '/portafolio/proyectos/chula/', priority: '0.6', changefreq: 'yearly' },
];

function getLastModified(relativePath) {
  try {
    const value = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', relativePath],
      { cwd: root, encoding: 'utf8', windowsHide: true }
    ).trim();
    if (value) return value.slice(0, 10);
  } catch {
    // Fall back to the file timestamp outside a Git checkout.
  }

  return statSync(resolve(root, relativePath)).mtime.toISOString().slice(0, 10);
}

const existingPages = pages.filter(page => {
  const exists = existsSync(resolve(root, page.file));
  if (!exists) console.warn(`Sitemap: omitted missing file ${page.file}`);
  return exists;
});

const urls = existingPages.map(page => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${getLastModified(page.file)}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /public/analytics/
Disallow: /portafolio/shop/viewer

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(resolve(root, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(resolve(root, 'robots.txt'), robots, 'utf8');
console.log(`Generated sitemap.xml with ${existingPages.length} URLs and robots.txt.`);
