import { useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { blogService, Post } from '../../services/blogService';
import { excerpt } from '../../lib/markdown';
import { useParams, Link } from 'react-router-dom';

const SUBSTACK_URL = 'https://createdigital.substack.com';

interface SubstackPost {
  title: string;
  description: string;
  url: string;
  date: string;
  slug?: string;
  image?: string | null;
}

interface BlogItem {
  key: string;
  title: string;
  excerpt: string;
  date: Date | null;
  href: string;
  external: boolean;
  image: string | null;
  sourceUrl: string | null;
  slug: string;
}

function CardLink({ item, children }: { item: BlogItem; children: ReactNode }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="block space-y-4 p-8">
        {children}
      </a>
    );
  }
  return (
    <Link to={item.href} className="block space-y-4 p-8">
      {children}
    </Link>
  );
}

export default function Blog() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchSitePosts = async (): Promise<BlogItem[]> => {
      try {
        const data = (await blogService.getPosts()) || [];
        return data.map((post: Post) => ({
          key: post.id || post.slug,
          title: post.title,
          excerpt: post.metaDescription?.trim() || excerpt(post.content, 150),
          date: post.createdAt?.toDate ? post.createdAt.toDate() : null,
          href: `/${lang}/blog/${post.slug}`,
          external: false,
          image: post.coverImage || null,
          sourceUrl: post.substackUrl || null,
          slug: post.slug,
        }));
      } catch (error) {
        console.error("Failed to fetch posts", error);
        return [];
      }
    };

    const fetchSubstackPosts = async (): Promise<BlogItem[]> => {
      try {
        const res = await fetch('/api/substack');
        const data = await res.json();
        return (data.posts || []).map((post: SubstackPost) => ({
          key: post.url,
          title: post.title,
          excerpt: post.description,
          date: new Date(post.date),
          href: post.url,
          external: true,
          image: post.image || null,
          sourceUrl: post.url,
          slug: post.slug || '',
        }));
      } catch (error) {
        console.error("Failed to fetch Substack posts", error);
        return [];
      }
    };

    Promise.all([fetchSitePosts(), fetchSubstackPosts()]).then(([site, rawSubstack]) => {
      // Si un artículo de Substack ya está publicado en la web, se muestra solo la versión de la web.
      const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
      const siteUrls = new Set(site.map(p => p.sourceUrl).filter(Boolean));
      const siteSlugs = new Set(site.map(p => p.slug));
      const siteTitles = new Set(site.map(p => norm(p.title)));
      const substack = rawSubstack.filter(p => !siteUrls.has(p.sourceUrl) && !siteSlugs.has(p.slug) && !siteTitles.has(norm(p.title)));
      const all = [...site, ...substack].sort(
        (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
      );
      setPosts(all);
      setIsLoading(false);
    });
  }, [lang]);

  const displayedPosts = showAll ? posts : posts.slice(0, 3);

  return (
    <section id="blog" className="py-16 md:py-32 px-6 md:px-12 bg-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-20">
        <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-tight leading-none">
          Blog <span className="text-gray-mid">/</span> Artículos
        </h2>
        <div className="space-y-3 md:text-right">
          <p className="font-dm text-xs uppercase tracking-[0.3em] text-cream/40 max-w-xs md:ml-auto">
            Pensamientos sobre diseño, marketing y estrategia digital.
          </p>
          <a
            href={`${SUBSTACK_URL}/subscribe`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-dm text-xs uppercase tracking-[0.2em] text-accent hover:text-white transition-colors"
          >
            Suscribite al newsletter en Substack →
          </a>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-8 md:space-y-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post, idx) => (
              <motion.div
                key={post.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group border border-gray-mid/20 hover:border-accent transition-all bg-gray-dark/30 overflow-hidden"
              >
                <CardLink item={post}>
                  {post.image && (
                    <div className="-mx-8 -mt-8 mb-6 aspect-[16/9] overflow-hidden bg-gray-dark">
                      <img src={post.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <span className="text-[10px] font-dm uppercase tracking-widest text-accent">
                    {post.date ? post.date.toLocaleDateString('es-AR') : ''}
                    {post.external && <span className="text-cream/40"> · Substack</span>}
                  </span>
                  <h3 className="font-barlow text-2xl text-cream group-hover:text-white transition-colors leading-tight uppercase">
                    {post.title}
                  </h3>
                  <p className="font-dm text-sm text-cream/50 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="inline-block pt-4 text-xs font-dm uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                    {post.external ? 'Leer en Substack →' : 'Leer más →'}
                  </span>
                </CardLink>
              </motion.div>
            ))}
          </div>

          {posts.length > 3 && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="border border-accent hover:bg-accent hover:text-black text-accent px-10 py-5 font-barlow font-bold uppercase tracking-widest text-xs transition-all hover:-translate-y-1 duration-300 rounded-sm interactive cursor-pointer"
              >
                {showAll ? t('blog.show_less', 'Ver menos') : t('blog.show_more', 'Ver más artículos')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-mid/30">
          <p className="font-dm text-cream/40 uppercase tracking-widest">Aún no hay artículos publicados.</p>
        </div>
      )}
    </section>
  );
}
