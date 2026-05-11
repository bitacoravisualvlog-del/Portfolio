import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

export default function Projects() {
  const { t } = useTranslation();
  const projects = [
    {
      id: 'p1',
      url: 'https://www.leyqueactiva.com',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
      tags: ['WordPress', 'UX/UI', 'SEO'],
      action: t('projects.view_site'),
      badge: 'Web',
      badgeColor: '#D278A6'
    },
    {
      id: 'p2',
      url: 'https://desaburrite.vercel.app',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
      tags: ['App Concept', 'UX/UI', 'Figma'],
      action: t('projects.view_project'),
      badge: t('projects.p2.badge'),
      badgeColor: '#D278A6'
    },
    {
      id: 'p3',
      url: 'https://www.behance.net/veronicacarneiro',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      tags: ['Meta Ads', 'Data Analysis', 'Performance'],
      action: t('projects.view_project'),
      badge: t('projects.p3.badge'),
      badgeColor: '#D278A6'
    }
  ];

  return (
    <section id="projects" className="py-32 px-6 md:px-12 bg-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-tight leading-none">
          Proyectos <span className="text-gray-mid">/</span> Projects
        </h2>
        <p className="font-dm text-xs uppercase tracking-[0.3em] text-cream/40 max-w-xs md:text-right">
          Una selección de trabajos que definen una visión estética y estratégica.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-24">
        {projects.map((p, idx) => {
          return (
            <motion.a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative flex flex-col interactive hover:-translate-y-2 transition-transform duration-300"
            >
              {/* ZONA SUPERIOR - PORTADA */}
              <div 
                className="relative h-[220px] md:h-[280px] bg-gray-dark border border-gray-mid/20 overflow-hidden mb-6 rounded-t-sm flex items-center justify-center"
                style={{ position: 'relative' }}
              >
                {/* TEXTURE BACKGROUND */}
                <div className="absolute inset-0 bg-[radial-gradient(var(--color-accent)_1px,transparent_1px)] [background-size:32px_32px] opacity-5" />

                {/* COVER TEXT (LARGE STYLIZED) */}
                <h3 className="font-bebas text-4xl md:text-5xl text-white/10 group-hover:text-accent/30 transition-all duration-500 uppercase text-center leading-none tracking-tighter z-10 px-4">
                  {t(`projects.${p.id}.cover`)}
                </h3>
                
                {/* OVERLAY GRADIENTE */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #0D0D0D 0%, #0D0D0D 20%, transparent 100%)',
                    zIndex: 5
                  }}
                />

                {/* BADGE (Optional) */}
                {p.badge && (
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      zIndex: 10,
                      background: p.badgeColor || '#D278A6',
                      color: '#F0EBE0',
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '2px'
                    }}
                  >
                    {p.badge}
                  </span>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-accent/90 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center z-20">
                  <span className="text-white font-barlow font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    {p.action} <ExternalLink size={16} />
                  </span>
                </div>
              </div>

              {/* ZONA INFERIOR - CONTENIDO */}
              <div className="space-y-4">
                <span className="text-cream/20 font-bebas text-2xl">{idx < 9 ? `0${idx + 1}` : idx + 1}</span>
                <div className="flex gap-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-dm uppercase tracking-widest text-cream/30 border border-gray-mid/40 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="font-barlow text-3xl text-cream group-hover:text-white transition-colors uppercase font-medium">
                  {t(`projects.${p.id}.title`)}
                </h4>
                <div className="font-dm text-sm text-cream/50 leading-relaxed whitespace-pre-wrap">
                  {t(`projects.${p.id}.desc`)}
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* BEHANCE CTA "APARTE" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gray-dark border border-gray-mid/20 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-sm"
      >
        <div className="max-w-xl text-center md:text-left">
          <h3 className="font-bebas text-4xl md:text-5xl text-white mb-4">
            {t('portfolio_cta.title')}
          </h3>
          <p className="font-dm text-cream/60">
            {t('portfolio_cta.desc')}
          </p>
        </div>
        <a 
          href="https://www.behance.net/veronicacarneiro" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-accent hover:bg-accent-hover text-black px-12 py-6 font-barlow font-bold uppercase tracking-widest transition-all rounded-sm interactive"
        >
          {t('portfolio_cta.button')}
        </a>
      </motion.div>
    </section>
  );
}


