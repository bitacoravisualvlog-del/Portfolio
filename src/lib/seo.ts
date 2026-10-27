import { useEffect } from 'react';

export const SITE_URL = 'https://www.createdigital.com.ar';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

interface SeoOptions {
  title: string;
  description: string;
  path: string;              // ej: "/es" o "/es/blog/mi-articulo"
  type?: 'website' | 'article';
  image?: string;
  lang?: string;
  publishedTime?: string;
}

// Crea o actualiza una etiqueta del <head> y devuelve una función que la restaura.
function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  const existed = !!el;
  const previous = el?.getAttribute(attr) ?? null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
  return () => {
    if (!existed) el?.remove();
    else if (previous !== null) el?.setAttribute(attr, previous);
  };
}

const meta = (key: 'name' | 'property', id: string, content: string) =>
  setTag(`meta[${key}="${id}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(key, id);
    return m;
  }, 'content', content);

const link = (rel: string, href: string) =>
  setTag(`link[rel="${rel}"]`, () => {
    const l = document.createElement('link');
    l.setAttribute('rel', rel);
    return l;
  }, 'href', href);

// Ajusta título, descripción, Open Graph y canonical de la página actual.
export function useSeo(opts: SeoOptions | null) {
  const key = opts ? JSON.stringify(opts) : '';
  useEffect(() => {
    if (!opts) return;
    const url = `${SITE_URL}${opts.path}`;
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;
    document.title = opts.title;
    if (opts.lang) document.documentElement.lang = opts.lang;

    const restore = [
      meta('name', 'description', opts.description),
      meta('property', 'og:title', opts.title),
      meta('property', 'og:description', opts.description),
      meta('property', 'og:url', url),
      meta('property', 'og:type', opts.type || 'website'),
      meta('property', 'og:image', opts.image || DEFAULT_IMAGE),
      meta('name', 'twitter:title', opts.title),
      meta('name', 'twitter:description', opts.description),
      link('canonical', url),
    ];
    if (opts.publishedTime) restore.push(meta('property', 'article:published_time', opts.publishedTime));

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang;
      restore.reverse().forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
