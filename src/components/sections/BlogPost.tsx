import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { blogService, Post, Comment } from '../../services/blogService';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

export default function BlogPost() {
  const { slug, lang } = useParams<{ slug: string; lang: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        const postData = await blogService.getPostBySlug(slug);
        if (postData) {
          setPost(postData);
          if (postData.id) {
            const commentData = await blogService.getComments(postData.id);
            if (commentData) setComments(commentData);
          }
        }
      } catch (error) {
        console.error("Error loading post", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?.id || !commentName || !commentText) return;
    setIsSubmitting(true);
    try {
      await blogService.addComment(post.id, {
        userName: commentName,
        content: commentText
      });
      setCommentName('');
      setCommentText('');
      // Refresh comments
      const refreshed = await blogService.getComments(post.id);
      if (refreshed) setComments(refreshed);
    } catch (error) {
      console.error("Error submitting comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-cream flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-bebas text-6xl mb-4">Post no encontrado</h1>
        <Link to={`/${lang}`} className="text-accent underline uppercase tracking-widest font-dm text-xs">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cream">
      <div className="grain-overlay" />
      <Header />

      <main className="pt-40 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="text-accent font-dm text-xs uppercase tracking-widest">
              {new Date(post.createdAt?.toDate()).toLocaleDateString()}
            </span>
            <h1 className="font-bebas text-6xl md:text-8xl leading-[0.9] text-white">
              {post.title}
            </h1>
          </div>

          <div className="w-full h-[1px] bg-gray-mid/20" />

          <div className="font-dm text-lg leading-relaxed text-cream/80 whitespace-pre-wrap py-8">
            {post.content}
          </div>

          <div className="w-full h-[1px] bg-gray-mid/20" />

          {/* Comments Section */}
          <section className="py-20 space-y-12">
            <h2 className="font-bebas text-4xl text-white">Comentarios</h2>

            <form onSubmit={handleCommentSubmit} className="space-y-6 bg-gray-dark/50 p-8 border border-gray-mid/20">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="bg-black border border-gray-mid/40 p-4 font-dm text-sm focus:border-accent outline-none transition-colors"
                />
              </div>
              <textarea
                placeholder="Escribe tu comentario..."
                required
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-black border border-gray-mid/40 p-4 font-dm text-sm focus:border-accent outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent text-white px-8 py-3 font-barlow font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Publicar comentario'}
              </button>
            </form>

            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l border-accent/30 pl-6 py-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-barlow font-bold uppercase text-cream">{comment.userName}</span>
                    <span className="text-[10px] text-cream/30 font-dm">
                      {new Date(comment.createdAt?.toDate()).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-dm text-sm text-cream/60 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="font-dm text-cream/30 italic text-sm">Sé el primero en comentar.</p>
              )}
            </div>
          </section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
