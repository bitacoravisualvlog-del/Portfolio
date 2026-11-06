import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Download, FileText, Check, MessageCircle } from 'lucide-react';
import { resources, services, type Resource, type Service } from '../../data/resources';
import YouTubeEmbed from '../ui/YouTubeEmbed';
import { trackEvent } from '../../lib/analytics';
import { getSavedLead } from '../../services/leadService';
import ResourceDownloadDialog, { recordLead, startDownload } from './ResourceDownloadDialog';

export default function Resources() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const [selected, setSelected] = useState<Resource | null>(null);
  const closeDialog = useCallback(() => setSelected(null), []);

  // Si ya dejó su email en este navegador, descarga directo y registra el recurso.
  const handleDownload = (resource: Resource) => {
    const saved = getSavedLead();
    if (saved?.email) {
      startDownload(resource);
      recordLead(resource, saved);
    } else {
      setSelected(resource);
    }
  };

  // "Consultar servicio": lleva al formulario de contacto con el asunto ya completo.
  const handleInquiry = (service: Service) => {
    trackEvent('service_inquiry_click', { service_id: service.id });
    window.dispatchEvent(new CustomEvent('cd:contact-prefill', { detail: { subject: service.inquirySubject } }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (resources.length === 0 && services.length === 0) return null;

  // Encabezado de cada grupo (mismo estilo que las categorías de UGC)
  const GroupTitle = ({ n, label }: { n: string; label: string }) => (
    <div className="flex items-center gap-4 mb-8 md:mb-12">
      <span className="font-barlow font-bold text-sm md:text-base uppercase tracking-[0.2em] text-accent md:whitespace-nowrap">
        <span className="text-cream/30">{n} · </span>{label}
      </span>
      <span className="flex-1 h-px bg-gray-mid/40" />
    </div>
  );

  return (
    <section id="recursos" className="py-16 md:py-32 px-6 md:px-12 bg-black border-t border-gray-mid/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-20">
        <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-tight leading-none">
          {t('resources.title', 'Recursos')} <span className="text-gray-mid">/</span> {t('resources.subtitle_tools', 'Herramientas')}
        </h2>
        <p className="font-dm text-xs uppercase tracking-[0.3em] text-cream/40 max-w-xs md:text-right">
          {t('resources.tagline_mixed', 'Recursos gratuitos y servicios para que hagas crecer tu marca.')}
        </p>
      </div>

      <div className="space-y-16 md:space-y-24">
      {resources.length > 0 && (
      <div>
      <GroupTitle n="01" label={t('resources.group_free', 'Gratuitos')} />
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
            <button
              type="button"
              onClick={() => handleDownload(resource)}
              aria-label={`${t('resources.download', 'Descargar gratis')}: ${resource.title}`}
              className="relative block w-full overflow-hidden bg-black p-6 sm:p-8 border-b sm:border-b-0 sm:border-r border-gray-mid/20 cursor-pointer"
            >
              <img
                src={resource.cover}
                alt={`Tapa: ${resource.title}`}
                decoding="async"
                width={909}
                height={1287}
                className="w-full max-w-[240px] sm:max-w-none mx-auto aspect-[909/1287] object-cover shadow-2xl shadow-accent/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-1deg]"
              />
            </button>

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
                <button
                  type="button"
                  onClick={() => handleDownload(resource)}
                  className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-black px-8 py-4 font-barlow font-bold uppercase tracking-widest text-sm transition-all hover:-translate-y-1 duration-300 interactive w-fit cursor-pointer"
                >
                  <Download size={18} />
                  {t('resources.download', 'Descargar gratis')}
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      </div>
      )}

      {services.length > 0 && (
        <div>
          <GroupTitle n={resources.length > 0 ? '02' : '01'} label={t('resources.group_services', 'Servicios · Consultar')} />
          <div className="space-y-12">
            {services.map((service) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-center border border-gray-mid/20 bg-gray-dark/30 p-5 sm:p-8 md:p-10"
              >
                <YouTubeEmbed videoId={service.youtubeId} title={service.videoTitle} />

                <div className="flex flex-col gap-6">
                  <div className="space-y-4">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-dm uppercase tracking-widest text-accent">
                      <span>{service.type}</span>
                      <span className="text-cream/30">·</span>
                      <span className="text-cream/50">{service.topic}</span>
                      {isEnglish && (
                        <>
                          <span className="text-cream/30">·</span>
                          <span className="text-cream/50">{t('resources.spanish', 'In Spanish')}</span>
                        </>
                      )}
                    </span>
                    <h3 className="font-barlow text-2xl md:text-3xl text-cream uppercase leading-tight">
                      {service.title}
                    </h3>
                    <p className="font-dm text-sm md:text-base text-cream/60 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-2.5">
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-3 font-dm text-sm text-cream/75 leading-snug">
                        <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleInquiry(service)}
                    className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-black px-8 py-4 font-barlow font-bold uppercase tracking-widest text-sm transition-all hover:-translate-y-1 duration-300 interactive w-fit cursor-pointer"
                  >
                    <MessageCircle size={18} />
                    {t('resources.inquire', 'Consultar servicio')}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}
      </div>

      <ResourceDownloadDialog resource={selected} onClose={closeDialog} />
    </section>
  );
}
