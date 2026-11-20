import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, PenLine } from 'lucide-react';
import { recommendationService, Recommendation } from '../../services/recommendationService';

// Recomendaciones en fila horizontal, debajo de las marcas que confían.
export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = () => {
    const el = rowRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };

  useEffect(() => {
    const id = setTimeout(updateEdges, 300);
    window.addEventListener('resize', updateEdges);
    return () => { clearTimeout(id); window.removeEventListener('resize', updateEdges); };
  }, [recommendations]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    el.scrollBy({ left: dir * ((card?.offsetWidth || 360) + 24), behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await recommendationService.getRecommendations();
        if (data) setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    setIsSubmitting(true);
    try {
      await recommendationService.addRecommendation({
        userName: name,
        content: text,
        rating
      });
      setName('');
      setText('');
      setRating(5);
      setSent(true);
      // Refresh
      const refreshed = await recommendationService.getRecommendations();
      if (refreshed) setRecommendations(refreshed);
    } catch (error) {
      console.error("Error submitting recommendation", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="recommendations" className="py-14 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <span className="text-accent font-dm text-[10px] uppercase tracking-[0.4em]">Recomendaciones</span>
            <h2 className="font-bebas text-4xl md:text-6xl text-white tracking-tight leading-none uppercase mt-3">
              Lo que dicen <span className="text-accent">mis clientes</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setShowForm(v => !v); setSent(false); }}
              className="inline-flex items-center gap-2 border border-gray-mid/60 hover:border-accent text-cream/80 hover:text-accent px-5 py-3 font-dm text-xs uppercase tracking-widest transition-colors"
            >
              <PenLine size={14} /> {showForm ? 'Cerrar' : 'Dejá tu recomendación'}
            </button>
            <button type="button" aria-label="Anterior" onClick={() => scrollByCard(-1)} disabled={edges.start}
              className="hidden md:grid place-items-center w-11 h-11 border border-gray-mid/60 text-cream/80 hover:border-accent hover:text-accent disabled:opacity-25 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button type="button" aria-label="Siguiente" onClick={() => scrollByCard(1)} disabled={edges.end}
              className="hidden md:grid place-items-center w-11 h-11 border border-gray-mid/60 text-cream/80 hover:border-accent hover:text-accent disabled:opacity-25 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              {sent ? (
                <p className="font-dm text-cream/80 bg-gray-dark/30 p-6 border border-accent/30 mb-10">¡Gracias por tu recomendación!</p>
              ) : (
                <form onSubmit={handleSubmit} className="grid md:grid-cols-[1fr_2fr_auto] gap-4 items-start bg-gray-dark/30 p-6 border border-gray-mid/20 mb-10">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Tu nombre / Empresa"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-gray-mid/40 p-4 font-dm text-sm focus:border-accent outline-none transition-colors"
                    />
                    <div className="flex items-center gap-3">
                      <span className="font-dm text-xs uppercase tracking-widest text-cream/40">Calificación</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} estrellas`} className="transition-transform hover:scale-110">
                            <Star size={18} className={star <= rating ? 'fill-accent text-accent' : 'text-gray-mid'} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <textarea
                    placeholder="¿Cómo fue tu experiencia trabajando conmigo?"
                    required
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-black border border-gray-mid/40 p-4 font-dm text-sm focus:border-accent outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-black px-8 py-4 font-barlow font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto md:px-12">
        {isLoading ? (
          <div className="flex justify-center p-16">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recommendations.length > 0 ? (
          <div
            ref={rowRef}
            onScroll={updateEdges}
            className="flex items-start gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 md:px-0 pb-2"
          >
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                data-card
                className="snap-start shrink-0 w-[85vw] sm:w-[360px] lg:w-[380px] min-h-[330px] bg-gray-dark/50 p-7 md:p-8 border-l-4 border-accent relative flex flex-col"
              >
                <div className="absolute top-3 right-6 font-bebas text-6xl text-accent/15 pointer-events-none">"</div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < (rec.rating || 5) ? 'fill-accent text-accent' : 'text-gray-mid/30'} />
                  ))}
                </div>
                <div className="flex-1">
                  <p className={`font-dm text-cream/80 italic leading-relaxed ${expanded === rec.id ? '' : 'line-clamp-6'}`}>{rec.content}</p>
                  {rec.content.length > 220 && (
                    <button type="button" onClick={() => setExpanded(expanded === rec.id ? null : rec.id || null)} className="mt-3 font-dm text-xs uppercase tracking-widest text-accent hover:text-white transition-colors">
                      {expanded === rec.id ? 'Leer menos' : 'Leer más'}
                    </button>
                  )}
                </div>
                <span className="font-barlow font-bold uppercase text-cream mt-6">{rec.userName}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center font-dm text-cream/20 py-16 uppercase tracking-widest">Aún no hay recomendaciones.</p>
        )}
      </div>
    </section>
  );
}
