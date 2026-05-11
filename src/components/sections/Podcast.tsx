import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Radio } from 'lucide-react';

export default function Podcast() {
  const { t } = useTranslation();
  const spotifyUrl = "https://open.spotify.com/show/03j0ceu1IrqUYqXmWHPX3Y?si=Vg9JQ9rOTAO7jgyZIchSuw";

  return (
    <section id="podcast" className="py-32 px-6 md:px-12 bg-gray-dark border-y border-gray-mid/20 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bebas text-[20rem] text-accent/5 pointer-events-none select-none whitespace-nowrap">
        MERLO'S PLACE
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square bg-black p-4 border border-gray-mid flex items-center justify-center relative group"
          >
            <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800" 
              alt="Merlo's Place Podcast" 
              className="w-full h-full object-cover grayscale brightness-75 transition-all group-hover:grayscale-0 group-hover:brightness-100"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur-md p-6 border-l-4 border-accent">
              <span className="font-bebas text-4xl text-white tracking-widest">{t('podcast.title')}</span>
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <Radio size={20} />
              <span className="text-xs font-dm uppercase tracking-widest">Podcast</span>
            </div>
            <h2 className="font-bebas text-5xl md:text-8xl text-white leading-none">
              {t('podcast.tagline')}
            </h2>
            <p className="font-dm text-cream/70 text-lg leading-relaxed max-w-xl">
              {t('podcast.desc')}
            </p>
          </div>

          <a 
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-accent hover:bg-accent-hover text-black px-10 py-5 font-barlow font-bold uppercase tracking-widest transition-all interactive"
          >
            {t('podcast.cta')}
          </a>
        </div>
      </div>
    </section>
  );
}
