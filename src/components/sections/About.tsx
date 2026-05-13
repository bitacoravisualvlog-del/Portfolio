import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: '15', label: t('about.stats.exp') },
    { value: '+5', label: t('about.stats.digital') },
    { value: '+60', label: t('about.stats.countries') },
  ];

  const skills = [
    'Meta Ads', 'Google Ads', 'WordPress', 'UX/UI', 'SEO', 
    'Copywriting', 'Video Editing', 'Community Management', 
    'Storytelling', 'HubSpot'
  ];

  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-black overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-20 items-center">
        {/* Left Column: Bio */}
        <div className="lg:col-span-7 space-y-12">
          <h2 className="font-bebas text-5xl md:text-8xl text-white tracking-tighter leading-none">
            SOBRE <span className="text-accent">MÍ</span>
          </h2>
          <p className="font-dm text-lg md:text-xl text-cream leading-relaxed max-w-3xl">
            {t('about.bio')}
          </p>
          <div className="flex flex-wrap gap-3">
            {skills.map(skill => (
              <span key={skill} className="bg-gray-dark border border-gray-mid/30 text-cream/60 px-4 py-1.5 text-xs font-dm uppercase tracking-widest">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className="lg:col-span-5 flex flex-col gap-12 lg:pl-12 lg:border-l border-gray-mid/20">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex items-center gap-8"
            >
              <span className="font-bebas text-8xl md:text-9xl text-accent leading-none select-none">
                {stat.value}
              </span>
              <p className="font-barlow text-sm md:text-base text-cream/40 uppercase tracking-widest max-w-[120px] leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
