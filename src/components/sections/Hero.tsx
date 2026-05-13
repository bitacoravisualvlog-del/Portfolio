import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden bg-black pt-8 md:pt-48">
      {/* Background Image - Verónica's Photo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-r md:from-black md:via-black/60 md:to-transparent" />
      </div>

      <div className="z-10 mb-12 md:mb-0 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <h1 className="text-[clamp(4.5rem,15vw,12rem)] leading-[0.85] text-cream flex flex-col font-bebas mb-2 md:mb-6">
            <span className="block">CREATE</span>
            <span className="block text-accent">DIGITAL</span>
          </h1>
          <div className="font-dm text-white text-sm md:text-base uppercase tracking-[0.4em] mb-12 opacity-80">
            {t('hero.subline')}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-xl md:text-2xl font-barlow text-cream/80 max-w-2xl mb-12 border-l-2 border-accent pl-6 py-2"
        >
          {t('hero.body')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col md:flex-row md:items-center gap-6"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-black px-8 py-4 font-barlow font-bold uppercase tracking-widest transition-all interactive h-fit w-fit"
          >
            {t('hero.cta')}
          </a>
        </motion.div>
      </div>

      {/* Decorative Background Element */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[30vw] h-[60vh] bg-accent/5 blur-[120px] rounded-full -mr-[10%]" />

    </section>
  );
}
