import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import PosterVideo from '../ui/PosterVideo';
import { BarChart3, Clapperboard, Link2, Gauge, Users, ShieldCheck } from 'lucide-react';

// Método GUION: la metodología propia de trabajo de CREATE DIGITAL.
const STAGES = [
  { letter: 'G', key: 'g' },
  { letter: 'U', key: 'u' },
  { letter: 'I', key: 'i' },
  { letter: 'O', key: 'o' },
  { letter: 'N', key: 'n' },
] as const;

const BENEFITS = [
  { key: 'data', Icon: BarChart3 },
  { key: 'cinema', Icon: Clapperboard },
  { key: 'connected', Icon: Link2 },
  { key: 'measure', Icon: Gauge },
  { key: 'team', Icon: Users },
  { key: 'transparency', Icon: ShieldCheck },
] as const;

export default function Method() {
  const { t } = useTranslation();

  const goToQuote = () => document.getElementById('presupuesto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="metodo" className="py-16 md:py-32 px-6 md:px-12 bg-black border-t border-gray-mid/10 relative overflow-hidden">
      <div className="absolute -top-20 right-0 w-[480px] h-[480px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Encabezado */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-end mb-14 md:mb-24">
          <div>
            <span className="block text-xs font-dm uppercase tracking-widest text-accent mb-4">
              {t('method.eyebrow', 'Metodología propia')}
            </span>
            <h2 className="font-bebas text-6xl md:text-9xl text-white leading-[0.85] tracking-tight">
              {t('method.title_1', 'Método')} <span className="text-accent">{t('method.title_2', 'GUION')}</span>
            </h2>
            <p className="font-barlow font-semibold text-xl md:text-2xl uppercase tracking-wide text-cream/80 mt-5">
              {t('method.tagline', 'Del dato a la historia, y de la historia al resultado.')}
            </p>
          </div>
          <p className="font-dm text-sm md:text-base text-cream/60 leading-relaxed">
            {t('method.intro', 'En el cine nada se filma sin guion. En CREATE DIGITAL tampoco: antes de diseñar una pieza o lanzar un anuncio, escribo el guion de tu marca con datos reales, y después lo mido semana a semana. Es la forma en que trabajo con cada cliente, en cada servicio.')}
          </p>
        </div>

        {/* Las cinco etapas */}
        <div className="mb-8 md:mb-10 flex items-center gap-4">
          <span className="font-barlow font-bold text-sm md:text-base uppercase tracking-[0.2em] text-accent">
            {t('method.stages_title', 'Cinco etapas, siempre las mismas')}
          </span>
          <span className="flex-1 h-px bg-gray-mid/40" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-l border-t border-gray-mid/25">
          {STAGES.map((stage, idx) => (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group relative flex flex-col border-r border-b border-gray-mid/25 p-6 md:p-7 hover:bg-gray-dark/40 transition-colors ${idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <span className="font-bebas text-[88px] md:text-[110px] leading-[0.8] text-accent/90 group-hover:text-accent transition-colors">
                {stage.letter}
              </span>
              <h3 className="font-bebas text-3xl text-white tracking-wide mt-3">{t(`method.${stage.key}.name`)}</h3>
              <span className="font-dm text-[10px] uppercase tracking-[0.3em] text-accent mt-1">{t(`method.${stage.key}.verb`)}</span>
              <p className="font-dm text-sm text-cream/60 leading-relaxed mt-4 flex-1">{t(`method.${stage.key}.desc`)}</p>
              <p className="font-dm text-xs text-cream/80 mt-5 pt-4 border-t border-gray-mid/25">
                <span className="text-cream/60 uppercase tracking-widest text-[9px] block mb-1">{t('method.deliverable', 'Entregable')}</span>
                {t(`method.${stage.key}.deliverable`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Por qué funciona */}
        <div className="mt-20 md:mt-28">
          <div className="mb-8 md:mb-12 flex items-center gap-4">
            <span className="font-barlow font-bold text-sm md:text-base uppercase tracking-[0.2em] text-accent">
              {t('method.benefits_title', 'Por qué funciona')}
            </span>
            <span className="flex-1 h-px bg-gray-mid/40" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-mid/25 border border-gray-mid/25">
            {BENEFITS.map(({ key, Icon }, idx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className="bg-black p-7 md:p-9 space-y-3 hover:bg-gray-dark/40 transition-colors"
              >
                <Icon size={22} className="text-accent" />
                <h3 className="font-barlow font-bold text-xl md:text-2xl uppercase tracking-wide text-cream">{t(`method.benefits.${key}.title`)}</h3>
                <p className="font-dm text-sm text-cream/55 leading-relaxed">{t(`method.benefits.${key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Brand film */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 md:mt-20 max-w-5xl mx-auto space-y-6"
        >
          <p className="font-dm text-xs uppercase tracking-[0.3em] text-cream/60">
            Brand <span className="text-accent">film</span>
          </p>
          <div className="relative w-full aspect-video border border-gray-mid/20 bg-gray-dark/30 overflow-hidden">
            <PosterVideo
              src="/brand-film-create-digital-2.mp4"
              poster="/brand-film-2-poster.webp"
              label="Brand film de CREATE DIGITAL"
            />
          </div>
        </motion.div>

        {/* Llamado a la acción */}
        <div className="mt-14 md:mt-20 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-accent/30 bg-gray-dark/30 p-7 md:p-10">
          <p className="font-bebas text-3xl md:text-4xl text-white leading-tight">
            {t('method.cta_text', '¿Querés que escribamos el guion de tu marca?')}
          </p>
          <button
            type="button"
            onClick={goToQuote}
            className="interactive inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent-hover text-black px-8 py-4 font-barlow font-bold uppercase tracking-widest text-sm transition-all hover:-translate-y-1 duration-300 shrink-0"
          >
            {t('method.cta', 'Pedí tu presupuesto')} →
          </button>
        </div>
      </div>
    </section>
  );
}
