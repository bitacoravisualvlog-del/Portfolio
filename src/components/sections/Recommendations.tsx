import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { recommendationService, Recommendation } from '../../services/recommendationService';

export default function Recommendations() {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        content: text
      });
      setName('');
      setText('');
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
    <section id="recommendations" className="py-32 px-6 md:px-12 bg-black border-t border-gray-mid/10">
      <div className="grid lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-tight leading-none uppercase">
            Recomendaciones <span className="text-gray-mid">/</span> Feedback
          </h2>
          <p className="font-dm text-cream/60 max-w-md">
            Tu opinión es fundamental para seguir creciendo. Si trabajamos juntos, me encantaría leer tu recomendación.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-dark/30 p-8 border border-gray-mid/20">
            <input
              type="text"
              placeholder="Tu nombre / Empresa"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-gray-mid/40 p-4 font-dm text-sm focus:border-accent outline-none transition-colors"
            />
            <textarea
              placeholder="¿Cómo fue tu experiencia trabajando conmigo?"
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-black border border-gray-mid/40 p-4 font-dm text-sm focus:border-accent outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white px-8 py-4 font-barlow font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar recomendación'}
            </button>
          </form>
        </div>

        <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
          {isLoading ? (
            <div className="flex justify-center p-20">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((rec, idx) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-dark/50 p-8 border-l-4 border-accent relative"
              >
                <div className="absolute top-4 right-8 font-bebas text-6xl text-accent/10 pointer-events-none">"</div>
                <p className="font-dm text-cream/80 italic mb-6 leading-relaxed">
                  {rec.content}
                </p>
                <div className="flex justify-between items-end">
                  <span className="font-barlow font-bold uppercase text-cream">{rec.userName}</span>
                  <span className="text-[10px] text-cream/30 font-dm">
                    {new Date(rec.createdAt?.toDate()).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center font-dm text-cream/20 py-20 uppercase tracking-widest">Aún no hay recomendaciones.</p>
          )}
        </div>
      </div>
    </section>
  );
}
