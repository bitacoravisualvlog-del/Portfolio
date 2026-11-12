import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, loginWithGoogle, logout, subscribeToAuth } from '../../lib/firebase';
import { blogService, Post } from '../../services/blogService';
import { contactService, ContactMessage } from '../../services/contactService';
import { leadService, Lead } from '../../services/leadService';
import { quoteService, Quote, QuoteStatus } from '../../services/quoteService';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Download, Trash2, Mail, MessageCircle } from 'lucide-react';
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
  const [metaDescription, setMetaDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadsError, setLeadsError] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [quotesError, setQuotesError] = useState(false);
  const [openQuote, setOpenQuote] = useState<string | null>(null);

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
      // Marca este navegador como tráfico interno para que Analytics no cuente tus visitas.
      try { localStorage.setItem('cd_internal', '1'); } catch { /* almacenamiento bloqueado */ }
      loadPosts();
      loadMessages();
      loadLeads();
      loadQuotes();
    }
  }, [isAdmin]);

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    setLeadsError(false);
    try {
      const data = await leadService.getAllLeads();
      setLeads(data || []);
    } catch (error) {
      console.error("Error loading leads", error);
      setLeadsError(true);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const loadQuotes = async () => {
    setIsLoadingQuotes(true);
    setQuotesError(false);
    try {
      const data = await quoteService.getAllQuotes();
      setQuotes(data || []);
    } catch (error) {
      console.error("Error loading quotes", error);
      setQuotesError(true);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  const handleQuoteStatus = async (id: string, status: QuoteStatus) => {
    try {
      await quoteService.updateStatus(id, status);
      setQuotes(qs => qs.map(q => (q.id === id ? { ...q, status } : q)));
    } catch (error) {
      alert('No se pudo cambiar el estado: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm('¿Borrar este pedido de presupuesto? No se puede deshacer.')) return;
    try {
      await quoteService.deleteQuote(id);
      setQuotes(qs => qs.filter(q => q.id !== id));
    } catch (error) {
      alert('No se pudo borrar: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const exportQuotesCsv = () => {
    const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Fecha', 'Estado', 'Nombre', 'Email', 'WhatsApp', 'Negocio', 'Rubro', 'Web', 'Objetivo', 'Plazo', 'Presupuesto', 'Servicios', 'Detalles'],
      ...quotes.map(q => [
        q.createdAt?.toDate ? q.createdAt.toDate().toLocaleString('es-AR') : '',
        q.status, q.name, q.email, q.phone, q.business, q.industry, q.website,
        q.goal, q.timeline, q.budget, (q.services || []).join(' · '), q.details,
      ]),
    ];
    const csv = '\ufeff' + rows.map(r => r.map(cell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `presupuestos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const waLink = (phone: string, name: string) => {
    let digits = (phone || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (!digits.startsWith('54') && digits.length <= 11) digits = '549' + digits.replace(/^15/, '');
    const text = encodeURIComponent(`Hola ${name.split(' ')[0]}! Soy Verónica, de CREATE DIGITAL. Te escribo por el presupuesto que pediste en la web.`);
    return `https://wa.me/${digits}?text=${text}`;
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('¿Borrar este contacto de la lista?')) return;
    try {
      await leadService.deleteLead(leadId);
      setLeads(leads.filter(l => l.id !== leadId));
    } catch (error) {
      alert('No se pudo borrar: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Exporta los leads a CSV (separado por ";" para que Excel en español lo abra en columnas).
  const exportLeadsCsv = () => {
    const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Fecha', 'Email', 'Nombre', 'Recurso', 'Acepta novedades'],
      ...leads.map(l => [
        l.createdAt?.toDate ? l.createdAt.toDate().toLocaleString('es-AR') : '',
        l.email,
        l.name,
        l.resourceTitle,
        l.marketingOptIn ? 'Sí' : 'No',
      ]),
    ];
    const csv = '﻿' + rows.map(r => r.map(cell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-recursos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      const code = (error as { code?: string })?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      const messages: Record<string, string> = {
        'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permití las ventanas emergentes para este sitio y volvé a intentar.',
        'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase (Authentication → Configuración → Dominios autorizados).',
        'auth/network-request-failed': 'No hay conexión. Revisá internet y volvé a intentar.',
      };
      alert(messages[code] || `No se pudo iniciar sesión${code ? ` (${code})` : ''}. Volvé a intentar.`);
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
          metaDescription: metaDescription.trim(),
        });
        alert('Post actualizado con éxito!');
      } else {
        await blogService.createPost({
          title,
          slug,
          content,
          metaDescription: metaDescription.trim(),
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
    setMetaDescription(post.metaDescription || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setContent('');
    setMetaDescription('');
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
              <div className="flex flex-wrap justify-between items-end gap-4 border-b border-accent/20 pb-2">
                <h2 className="font-bebas text-3xl">
                  Pedidos de Presupuesto {quotes.length > 0 && <span className="text-cream/40">({quotes.filter(q => q.status === 'nuevo').length} nuevos de {quotes.length})</span>}
                </h2>
                {quotes.length > 0 && (
                  <button
                    onClick={exportQuotesCsv}
                    className="inline-flex items-center gap-2 text-accent hover:text-white font-dm text-xs uppercase tracking-widest pb-1 transition-colors"
                  >
                    <Download size={14} /> Exportar CSV
                  </button>
                )}
              </div>
              {isLoadingQuotes ? (
                <p className="font-dm text-cream/40">Cargando pedidos...</p>
              ) : quotesError ? (
                <p className="font-dm text-cream/40 italic">No se pudieron cargar los pedidos. Revisá que la regla de "quotes" esté publicada en Firebase.</p>
              ) : quotes.length === 0 ? (
                <p className="font-dm text-cream/40 italic">Todavía no llegaron pedidos de presupuesto.</p>
              ) : (
                <div className="space-y-4">
                  {quotes.map(q => {
                    const isOpen = openQuote === q.id;
                    const wa = waLink(q.phone, q.name);
                    const subject = encodeURIComponent(`Tu presupuesto de CREATE DIGITAL · ${q.business}`);
                    return (
                      <div key={q.id} className={`bg-gray-dark border p-5 md:p-6 space-y-4 ${q.status === 'nuevo' ? 'border-accent/50' : 'border-gray-mid/20'}`}>
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <button type="button" onClick={() => setOpenQuote(isOpen ? null : q.id || null)} className="text-left flex-1 min-w-[220px]">
                            <h3 className="font-bebas text-2xl text-white leading-none">{q.business} <span className="text-cream/40 text-lg">· {q.industry}</span></h3>
                            <p className="font-dm text-sm text-cream/70 mt-1">{q.name} · {q.email}{q.phone && ` · ${q.phone}`}</p>
                            <p className="font-dm text-[11px] text-cream/40 mt-1 uppercase tracking-widest">
                              {q.createdAt?.toDate ? q.createdAt.toDate().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : 'Recién'} · {(q.services || []).length} servicios · {isOpen ? 'ocultar detalle ▲' : 'ver detalle ▼'}
                            </p>
                          </button>
                          <div className="flex items-center gap-2">
                            <select
                              value={q.status}
                              onChange={(e) => q.id && handleQuoteStatus(q.id, e.target.value as QuoteStatus)}
                              className="bg-black border border-gray-mid/30 px-3 py-2 font-dm text-xs uppercase tracking-widest text-cream focus:border-accent outline-none"
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="enviado">Presupuesto enviado</option>
                              <option value="cerrado">Cerrado</option>
                            </select>
                            <a href={`mailto:${q.email}?subject=${subject}`} className="p-2 text-cream/50 hover:text-accent transition-colors" title="Responder por mail"><Mail size={18} /></a>
                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="p-2 text-cream/50 hover:text-accent transition-colors" title="Escribir por WhatsApp"><MessageCircle size={18} /></a>}
                            <button onClick={() => q.id && handleDeleteQuote(q.id)} className="p-2 text-cream/30 hover:text-red-500 transition-colors" title="Borrar"><Trash2 size={18} /></button>
                          </div>
                        </div>
                        {isOpen && (
                          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-mid/20 font-dm text-sm">
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase tracking-widest text-accent">Servicios pedidos</p>
                              <ul className="space-y-1 text-cream/80">
                                {(q.services || []).map(s => <li key={s}>· {s}</li>)}
                              </ul>
                            </div>
                            <dl className="space-y-2 text-cream/80">
                              {[
                                ['Objetivo', q.goal], ['Plazo', q.timeline], ['Presupuesto aproximado', q.budget],
                                ['Web o Instagram', q.website], ['Idioma', q.lang],
                              ].map(([k, v]) => (
                                <div key={k}><dt className="text-[10px] uppercase tracking-widest text-cream/40">{k}</dt><dd>{v || '—'}</dd></div>
                              ))}
                            </dl>
                            {q.details && (
                              <p className="md:col-span-2 text-cream/80 whitespace-pre-wrap border-l-2 border-accent/30 pl-4 italic">"{q.details}"</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

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
                      onChange={(e) => setSlug(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD').replace(/[̀-ͯ]/g, '') // saca tildes
                          .replace(/[^a-z0-9-\s]/g, '')
                          .replace(/\s+/g, '-')
                      )}
                      className="w-full bg-black border border-gray-mid/30 p-4 font-dm text-cream focus:border-accent outline-none"
                      placeholder="el-futuro-del-diseno"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">Meta descripción (Google)</label>
                    <span className={`text-[10px] font-dm ${metaDescription.length > 160 ? 'text-accent' : 'text-cream/30'}`}>
                      {metaDescription.length}/160
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-black border border-gray-mid/30 p-4 font-dm text-cream focus:border-accent outline-none"
                    placeholder="Opcional. El texto que aparece debajo del título en Google. Si lo dejás vacío, se usa el comienzo del artículo."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">Contenido (Markdown)</label>
                  <textarea
                    required
                    rows={18}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-black border border-gray-mid/30 p-4 text-cream focus:border-accent outline-none font-mono text-sm leading-relaxed"
                    placeholder={'Escribí el artículo acá.\n\n## Subtítulo (H2)\n### Sub-subtítulo (H3)\n\n**negrita**, *cursiva*, [texto del link](https://...)\n\n- viñeta\n- otra viñeta\n\n![descripción de la imagen](https://url-de-la-imagen.jpg)'}
                  />
                  <p className="text-[10px] font-dm text-cream/30 leading-relaxed">
                    El título del artículo ya es el H1: dentro del texto usá ## para H2 y ### para H3. Dejá una línea en blanco entre párrafos.
                  </p>
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

            <section className="space-y-8">
              <div className="flex flex-wrap justify-between items-end gap-4 border-b border-accent/20 pb-2">
                <h2 className="font-bebas text-3xl">
                  Descargas de Recursos {leads.length > 0 && <span className="text-cream/40">({leads.length})</span>}
                </h2>
                {leads.length > 0 && (
                  <button
                    onClick={exportLeadsCsv}
                    className="inline-flex items-center gap-2 text-accent hover:text-white font-dm text-xs uppercase tracking-widest pb-1 transition-colors"
                  >
                    <Download size={14} /> Exportar CSV
                  </button>
                )}
              </div>
              {isLoadingLeads ? (
                <p className="font-dm text-cream/40">Cargando descargas...</p>
              ) : leadsError ? (
                <p className="font-dm text-cream/40 italic">No se pudieron cargar las descargas. Revisá que la regla de "leads" esté publicada en Firebase.</p>
              ) : leads.length === 0 ? (
                <p className="font-dm text-cream/40 italic">Todavía nadie descargó recursos.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-mid/20">
                  <table className="w-full font-dm text-sm">
                    <thead className="bg-gray-dark text-[10px] uppercase tracking-widest text-cream/40 text-left">
                      <tr>
                        <th className="p-4 font-normal">Fecha</th>
                        <th className="p-4 font-normal">Email</th>
                        <th className="p-4 font-normal">Nombre</th>
                        <th className="p-4 font-normal">Recurso</th>
                        <th className="p-4 font-normal">Novedades</th>
                        <th className="p-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(l => (
                        <tr key={l.id} className="border-t border-gray-mid/20">
                          <td className="p-4 text-cream/50 whitespace-nowrap">
                            {l.createdAt?.toDate ? l.createdAt.toDate().toLocaleDateString('es-AR') : '—'}
                          </td>
                          <td className="p-4 text-cream">
                            <a href={`mailto:${l.email}`} className="hover:text-accent">{l.email}</a>
                          </td>
                          <td className="p-4 text-cream/70">{l.name || '—'}</td>
                          <td className="p-4 text-cream/70">{l.resourceTitle}</td>
                          <td className="p-4">
                            <span className={l.marketingOptIn ? 'text-accent' : 'text-cream/30'}>{l.marketingOptIn ? 'Sí' : 'No'}</span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => l.id && handleDeleteLead(l.id)}
                              className="p-2 text-cream/30 hover:text-red-500 transition-colors"
                              title="Borrar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
