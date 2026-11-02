import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Download, FileText } from 'lucide-react';
import { resources } from '../../data/resources';

export default function Resources() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');

  if (resources.length === 0) return null;

  return (
    <section id="recursos" className="py-16 md:py-32 px-6 md:px-12 bg-black border-t border-gray-mid/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-20">
        <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-tight leading-none">
          {t('resources.title', 'Recursos')} <span className="text-gray-mid">/</span> {t('resources.subtitle', 'Descargables')}
        </h2>
        <p className="font-dm text-xs uppercase tracking-[0.3em] text-cream/40 max-w-xs md:text-right">
          {t('resources.tagline', 'Herramientas gratuitas para que hagas crecer tu marca.')}
        </p>
      </div>

      <div className={`grid gap-8 ${resources.length === 1 ? 'max-w-5xl' : 'lg:grid-cols-2'}`}>
        {resources.map((resource, idx) => (
          <motion.article
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] border border-gray-mid/20 bg-gray-dark/30 hover:border-accent transition-colors"
          >
            {/* Tapa del recurso */}
            <a
              href={resource.file}
              download
              aria-label={`${t('resources.download', 'Descargar gratis')}: ${resource.title}`}
              className="relative block overflow-hidden bg-black p-6 sm:p-8 border-b sm:border-b-0 sm:border-r border-gray-mid/20"
            >
              <img
                src={resource.cover}
                alt={`Tapa: ${resource.title}`}
                decoding="async"
                width={909}
                height={1287}
                className="w-full max-w-[240px] sm:max-w-none mx-auto aspect-[909/1287] object-cover shadow-2xl shadow-accent/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-1deg]"
              />
            </a>

            {/* Información y descarga */}
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 md:p-10">
              <div className="space-y-4">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-dm uppercase tracking-widest text-accent">
                  <span>{resource.type}</span>
                  <span className="text-cream/30">·</span>
                  <span className="text-cream/50">{resource.topic}</span>
                  {isEnglish && (
                    <>
                      <span className="text-cream/30">·</span>
                      <span className="text-cream/50">{t('resources.spanish', 'In Spanish')}</span>
                    </>
                  )}
                </span>
                <h3 className="font-barlow text-2xl md:text-3xl text-cream uppercase leading-tight">
                  {resource.title}
                </h3>
                <p className="font-dm text-sm md:text-base text-cream/60 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="space-y-4">
                <span className="flex items-center gap-2 font-dm text-[11px] uppercase tracking-widest text-cream/40">
                  <FileText size={14} />
                  {resource.format}
                  {resource.pages ? ` · ${resource.pages} ${t('resources.pages', 'páginas')}` : ''}
                  {` · ${t('resources.free', 'Gratis')}`}
                </span>
                <a
                  href={resource.file}
                  download
                  className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-black px-8 py-4 font-barlow font-bold uppercase tracking-widest text-sm transition-all hover:-translate-y-1 duration-300 interactive w-fit"
                >
                  <Download size={18} />
                  {t('resources.download', 'Descargar gratis')}
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
