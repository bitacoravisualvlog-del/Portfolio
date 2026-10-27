// Genera /sitemap.xml con las páginas fijas del sitio y los artículos
// publicados del blog (leídos de Firestore). Vercel lo cachea una hora.

const SITE = 'https://www.createdigital.com.ar';
const PROJECT_ID = 'gen-lang-client-0970974790';
const DATABASE_ID = 'ai-studio-7ba0d02d-cf8e-442b-8ae5-aba43058560a';
const RUN_QUERY_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents:runQuery`;

const escapeXml = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const day = (date) => (date ? new Date(date).toISOString().slice(0, 10) : null);

// Lee los artículos publicados con la API REST de Firestore (lectura pública según las reglas).
export async function fetchPublishedPosts() {
  const response = await fetch(RUN_QUERY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'posts' }],
        where: { fieldFilter: { field: { fieldPath: 'published' }, op: 'EQUAL', value: { booleanValue: true } } },
      },
    }),
  });
  if (!response.ok) throw new Error(`Firestore respondió ${response.status}`);
  return parsePosts(await response.json());
}

export function parsePosts(rows) {
  return (rows || [])
    .filter((row) => row.document?.fields?.slug?.stringValue)
    .map(({ document: d }) => ({
      slug: d.fields.slug.stringValue,
      lastmod: d.fields.updatedAt?.timestampValue || d.fields.createdAt?.timestampValue || d.updateTime,
    }));
}

const urlEntry = ({ loc, lastmod, priority, alternates }) => [
  '  <url>',
  `    <loc>${escapeXml(loc)}</loc>`,
  ...(alternates || []).map(
    ([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`
  ),
  lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
  priority ? `    <priority>${priority}</priority>` : null,
  '  </url>',
].filter(Boolean).join('\n');

export function buildSitemap(posts, today = day(new Date())) {
  const homeAlternates = [['es', `${SITE}/es`], ['en', `${SITE}/en`], ['x-default', `${SITE}/es`]];
  const entries = [
    { loc: `${SITE}/es`, lastmod: today, priority: '1.0', alternates: homeAlternates },
    { loc: `${SITE}/en`, lastmod: today, priority: '0.8', alternates: homeAlternates },
    ...posts.map((p) => ({ loc: `${SITE}/es/blog/${encodeURIComponent(p.slug)}`, lastmod: day(p.lastmod), priority: '0.7' })),
    { loc: `${SITE}/es/privacy`, priority: '0.3' },
    { loc: `${SITE}/en/privacy`, priority: '0.3' },
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map(urlEntry),
    '</urlset>',
    '',
  ].join('\n');
}

export default async function handler(req, res) {
  let posts = [];
  let ok = true;
  try {
    posts = await fetchPublishedPosts();
  } catch (error) {
    ok = false; // si Firestore falla, igual se sirven las páginas fijas
    console.error('sitemap: no se pudieron leer los artículos', error);
  }
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', ok ? 's-maxage=3600, stale-while-revalidate=86400' : 's-maxage=300');
  res.status(200).send(buildSitemap(posts));
}
