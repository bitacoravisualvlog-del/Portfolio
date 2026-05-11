import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { blogService, Post } from '../../services/blogService';
import { useParams, Link } from 'react-router-dom';

export default function Blog() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getPosts();
        if (data) setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-32 px-6 md:px-12 bg-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-tight leading-none">
          Blog <span className="text-gray-mid">/</span> Artículos
        </h2>
        <p className="font-dm text-xs uppercase tracking-[0.3em] text-cream/40 max-w-xs md:text-right">
          Pensamientos sobre diseño, marketing y estrategia digital.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group border border-gray-mid/20 p-8 hover:border-accent transition-all bg-gray-dark/30"
            >
              <Link to={`/${lang}/blog/${post.slug}`} className="block space-y-4">
                <span className="text-[10px] font-dm uppercase tracking-widest text-accent">
                  {new Date(post.createdAt?.toDate()).toLocaleDateString()}
                </span>
                <h3 className="font-barlow text-2xl text-cream group-hover:text-white transition-colors leading-tight uppercase">
                  {post.title}
                </h3>
                <p className="font-dm text-sm text-cream/50 line-clamp-3">
                  {post.content.substring(0, 150)}...
                </p>
                <span className="inline-block pt-4 text-xs font-dm uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                  Leer más →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-mid/30">
          <p className="font-dm text-cream/40 uppercase tracking-widest">Aún no hay artículos publicados.</p>
        </div>
      )}
    </section>
  );
}
