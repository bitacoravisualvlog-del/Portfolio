// Lee el feed RSS de Substack y lo devuelve como JSON para la sección Blog.
// Vercel lo sirve en /api/substack y lo cachea una hora.

const FEED_URL = 'https://createdigital.substack.com/feed';

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
};

export function parseFeed(xml) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items.map((item) => {
    const image = (item.match(/<enclosure[^>]*url="([^"]+)"/) || [])[1] || null;
    return {
      title: tag(item, 'title'),
      description: tag(item, 'description'),
      url: tag(item, 'link'),
      date: new Date(tag(item, 'pubDate')).toISOString(),
      image,
    };
  });
}

export default async function handler(req, res) {
  try {
    const response = await fetch(FEED_URL, { headers: { 'User-Agent': 'createdigital.com.ar' } });
    if (!response.ok) throw new Error(`Substack respondió ${response.status}`);
    const posts = parseFeed(await response.text());
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ posts });
  } catch (error) {
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).json({ posts: [], error: String(error) });
  }
}
