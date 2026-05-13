import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, loginWithGoogle, logout, subscribeToAuth } from '../../lib/firebase';
import { blogService, Post } from '../../services/blogService';
import { contactService, ContactMessage } from '../../services/contactService';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Trash2 } from 'lucide-react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const ADMIN_EMAIL = 'veronica.pereyracarneiro01@gmail.com';

export default function Admin() {
  const { lang = 'es' } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL && user?.emailVerified;

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadPosts();
      loadMessages();
    }
  }, [isAdmin]);

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const data = await blogService.getAllPosts();
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const data = await contactService.getAllMessages();
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await blogService.updatePost(editingId, {
          title,
          slug,
          content,
        });
        alert('Post actualizado con éxito!');
      } else {
        await blogService.createPost({
          title,
          slug,
          content,
          published: true
        });
        alert('Post publicado con éxito!');
      }
      handleCancelEdit();
      loadPosts();
    } catch (error) {
      console.error("Error saving post", error);
      alert('Error al guardar: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id || null);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setContent('');
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('¿Estás segura de que quieres borrar este artículo?')) return;
    try {
      await blogService.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
      alert('Artículo borrado.');
    } catch (error) {
      console.error("Error deleting post", error);
      alert('Error al borrar.');
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center font-bebas text-white text-4xl">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-cream">
      <div className="grain-overlay" />
      <Header />

      <main className="pt-40 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        {!user ? (
          <div className="text-center space-y-8 py-20">
            <h1 className="font-bebas text-6xl">Acceso Admin</h1>
            <p className="font-dm text-cream/60">Inicia sesión con tu cuenta de Google para gestionar el blog.</p>
            <button
              onClick={handleLogin}
              className="bg-accent text-white px-12 py-4 font-barlow font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
            >
              Iniciar sesión con Google
            </button>
          </div>
        ) : !isAdmin ? (
          <div className="text-center space-y-8 py-20">
            <h1 className="font-bebas text-6xl">Acceso denegado</h1>
            <p className="font-dm text-cream/60">Esta zona es exclusiva para la administración de CREATE DIGITAL ({ADMIN_EMAIL}).</p>
            <p className="font-dm text-xs text-accent">Usuario actual: {user.email}</p>
            <button
              onClick={logout}
              className="text-white underline font-dm text-xs uppercase tracking-widest"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-20"
          >
            <div className="flex justify-between items-end">
              <h1 className="font-bebas text-6xl">Gestión de Blog</h1>
              <button
                onClick={logout}
                className="text-accent underline font-dm text-xs uppercase tracking-widest pb-2"
              >
                Cerrar sesión
              </button>
            </div>

            <section className="space-y-8">
              <h2 className="font-bebas text-3xl border-b border-accent/20 pb-2">
                {editingId ? 'Editar Artículo' : 'Nuevo Artículo'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-dark border border-gray-mid/20 p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">Título</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-black border border-gray-mid/30 p-4 font-dm text-cream focus:border-accent outline-none"
                      placeholder="El futuro del diseño UX..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="w-full bg-black border border-gray-mid/30 p-4 font-dm text-cream focus:border-accent outline-none"
                      placeholder="el-futuro-del-diseno"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">Contenido</label>
                  <textarea
                    required
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-black border border-gray-mid/30 p-4 font-dm text-cream focus:border-accent outline-none font-sans"
                    placeholder="Escribe el contenido de tu artículo aquí..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-accent text-white py-4 font-barlow font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Guardando...' : editingId ? 'Actualizar Artículo' : 'Publicar Artículo'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-mid/20 text-cream px-8 py-4 font-dm text-xs uppercase tracking-widest hover:bg-gray-mid/30 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="space-y-8">
              <h2 className="font-bebas text-3xl border-b border-accent/20 pb-2">Artículos Publicados</h2>
              {isLoadingPosts ? (
                <p className="font-dm text-cream/40">Cargando artículos...</p>
              ) : posts.length === 0 ? (
                <p className="font-dm text-cream/40 italic">No hay artículos publicados aún.</p>
              ) : (
                <div className="space-y-4">
                  {posts.map(p => (
                    <div key={p.id} className="bg-gray-dark border border-gray-mid/20 p-4 flex justify-between items-center group hover:border-accent/40 transition-colors">
                      <div>
                        <h3 className="font-bebas text-xl text-white">{p.title}</h3>
                        <p className="font-dm text-xs text-cream/40">/{p.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-cream/20 hover:text-accent transition-colors p-2"
                          title="Editar artículo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button
                          onClick={() => p.id && handleDelete(p.id)}
                          className="text-cream/20 hover:text-red-500 transition-colors p-2"
                          title="Eliminar artículo"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-8">
              <h2 className="font-bebas text-3xl border-b border-accent/20 pb-2">Consultas de Contacto</h2>
              {isLoadingMessages ? (
                <p className="font-dm text-cream/40">Cargando mensajes...</p>
              ) : messages.length === 0 ? (
                <p className="font-dm text-cream/40 italic">No hay consultas recibidas aún.</p>
              ) : (
                <div className="space-y-6">
                  {messages.map(m => (
                    <div key={m.id} className="bg-gray-dark border border-gray-mid/20 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bebas text-xl text-accent">{m.subject}</h3>
                          <p className="font-dm text-sm text-cream font-bold">
                            {m.name} ({m.email}) 
                            {m.phone && <span className="ml-2 text-cream/60">| Tel: {m.phone}</span>}
                          </p>
                        </div>
                        <span className="font-dm text-[10px] text-cream/40 uppercase">
                          {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString() : 'Recientemente'}
                        </span>
                      </div>
                      <p className="font-dm text-sm text-cream/80 whitespace-pre-wrap border-l-2 border-accent/30 pl-4 py-1 italic">
                        "{m.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
