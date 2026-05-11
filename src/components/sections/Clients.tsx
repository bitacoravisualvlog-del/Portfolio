import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function Clients() {
  const { t } = useTranslation();
  
  const clients = [
    'Shori Suhi',
    'Tienda Luba',
    'Juan Asensi microcapilar',
    'Ley que Activa',
    'Arsumo'
  ];

  return (
    <section className="py-20 bg-black border-y border-gray-mid/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <span className="text-accent font-dm text-[10px] uppercase tracking-[0.4em]">
            {t('clients.subtitle')}
          </span>
          <h2 className="font-bebas text-2xl md:text-3xl text-white/40 italic">
            {t('clients.title')}
          </h2>
        </motion.div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="py-12 animate-marquee whitespace-nowrap flex items-center">
          {[...clients, ...clients, ...clients].map((client, idx) => (
            <span 
              key={idx} 
              className="mx-12 font-bebas text-4xl md:text-6xl text-white/20 hover:text-accent transition-colors cursor-default"
            >
              {client}
            </span>
          ))}
        </div>

        {/* Gradient overlays for the fade effect at edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
      </div>
    </section>
  );
}
