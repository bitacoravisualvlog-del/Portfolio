import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Film } from 'lucide-react';
import VideoFrame, { type VideoItem, useVideoPlayback } from '../ui/VideoFrame';

// Trabajos UGC agrupados por categoría.
// Para sumar uno nuevo: subí el video (.mp4) y su tapa a /public, agregá un objeto acá
// y sus textos en src/messages (es.json y en.json, dentro de "ugc").
// Los spec ads hechos con IA van en la sección aparte AIContent.
type CategoryId = 'beauty' | 'hospitality';

interface UgcItem extends VideoItem {
  category: CategoryId;
}

const CATEGORIES: { id: CategoryId; labelKey: string; fallback: string }[] = [
  { id: 'beauty', labelKey: 'ugc.cat_beauty', fallback: 'Productos · Belleza y cuidado de la piel' },
  { id: 'hospitality', labelKey: 'ugc.cat_hospitality', fallback: 'Hotelería y turismo' },
];

const WILDFI = { name: 'WILDFI', url: 'https://www.wildfi.com/es/' };

const UGC_ITEMS: UgcItem[] = [
  {
    id: 'vichy',
    category: 'beauty',
    badge: 'VICHY',
    titleKey: 'ugc.loreal1',
    descKey: 'ugc.desc1',
    video: '/loreal1.mp4',
    poster: '/loreal1.png',
    agency: WILDFI,
  },
  {
    id: 'la-roche-posay',
    category: 'beauty',
    badge: 'LA ROCHE-POSAY',
    titleKey: 'ugc.loreal2',
    descKey: 'ugc.desc2',
    video: '/loreal2.mp4',
    poster: '/loreal2.png',
    agency: WILDFI,
  },
  {
    id: 'hotel-emperador',
    category: 'hospitality',
    badge: 'HOTEL EMPERADOR',
    titleKey: 'ugc.hotel_emperador',
    descKey: 'ugc.desc_hotel_emperador',
    video: '/ugc-hotel-emperador.mp4',
    poster: '/ugc-hotel-emperador.webp',
  },
];

export default function UGC() {
  const { t } = useTranslation();
  const { frameProps } = useVideoPlayback();

  const renderItem = (item: UgcItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="flex flex-col"
    >
      <VideoFrame item={item} {...frameProps(item.id)} />

      {/* Ficha debajo del celular */}
      <div className="mt-8 text-center px-4 mx-auto w-full group/info max-w-sm">
        <h3 className="font-barlow text-2xl text-cream group-hover/info:text-accent font-bold uppercase tracking-wide transition-colors duration-300">
          {t(item.titleKey)}
        </h3>

        {item.agency && (
          <div className="mt-2.5 flex items-center justify-center gap-1 text-xs">
            <span className="font-dm text-cream/40 uppercase tracking-widest text-[10px]">
              {t('ugc.agency')}
            </span>
            <a
              href={item.agency.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-dm text-accent hover:text-white underline font-extrabold uppercase tracking-widest text-[10px] transition-colors duration-300"
            >
              {item.agency.name}
            </a>
          </div>
        )}

        <p className="font-dm text-sm text-cream/60 leading-relaxed mt-4">
          {t(item.descKey)}
        </p>
        {item.noteKey && (
          <p className="font-dm text-[11px] text-cream/35 italic mt-3">{t(item.noteKey)}</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <section id="ugc" className="py-16 md:py-24 px-6 md:px-12 bg-black relative overflow-hidden">
      {/* Resplandores decorativos */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Encabezado */}
        <div className="flex flex-col mb-10 md:mb-20">
          <div className="flex items-center gap-2 text-accent mb-4">
            <Film size={18} className="animate-pulse" />
            <span className="text-xs font-dm uppercase tracking-widest">{t('ugc.subtitle')}</span>
          </div>
          <h2 className="font-bebas text-5xl md:text-8xl text-white leading-none tracking-tight">
            {t('ugc.title')}
          </h2>
          <p className="font-dm text-cream/40 text-xs md:text-sm uppercase tracking-wider mt-3">
            {t('ugc.formats')}
          </p>
        </div>

        {/* Videos por categoría */}
        <div className="space-y-16 md:space-y-24">
          {CATEGORIES.map((category, catIndex) => {
            const items = UGC_ITEMS.filter(item => item.category === category.id);
            const gridClass = items.length > 1 ? 'md:grid-cols-2 max-w-5xl' : 'max-w-sm';
            if (items.length === 0) return null;
            return (
              <div key={category.id}>
                <div className="flex items-center gap-4 max-w-5xl mx-auto mb-8 md:mb-12">
                  <span className="font-barlow font-bold text-sm md:text-base uppercase tracking-[0.2em] text-accent md:whitespace-nowrap">
                    <span className="text-cream/30">{String(catIndex + 1).padStart(2, '0')} · </span>
                    {t(category.labelKey, category.fallback)}
                  </span>
                  <span className="flex-1 h-px bg-gray-mid/40" />
                </div>
                <div className={`grid grid-cols-1 gap-12 mx-auto ${gridClass}`}>
                  {items.map(renderItem)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Proposals / Collaborations Section */}
        <div className="mt-16 mb-10 md:mt-32 md:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-dm uppercase tracking-widest text-accent mb-3 block">Formatos de Colaboración</span>
            <h3 className="font-bebas text-4xl md:text-6xl text-white tracking-wide uppercase leading-none">
              Planes y Propuestas UGC
            </h3>
            <p className="font-dm text-cream/40 text-xs md:text-sm uppercase tracking-widest mt-4">
              Encontrá el formato ideal para potenciar la presencia digital de tu marca
            </p>
          </motion.div>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12 md:mb-24 items-stretch px-4">
          {[
            {
              id: 1,
              title: "COLABORACIÓN POR CANJE",
              subtitle: "PROPUESTA 1",
              description: "Me interesa colaborar con marcas alineadas a moda, lifestyle, beauty y tendencias digitales creando contenido auténtico y orgánico para redes sociales.",
              includes: [
                "1 Reel UGC / TikTok",
                "Historias mostrando producto o experiencia",
                "Edición completa estilo TikTok/Reels",
                "Entrega del contenido para reutilizar en redes"
              ],
              modality: "Canje por productos o experiencia",
              highlightLabel: "Ideal para:",
              highlightText: "Marcas emergentes que quieran material fresco, natural y de alta estética para alimentar sus redes.",
              badge: "CANJE"
            },
            {
              id: 2,
              title: "PRODUCTO + PAGO",
              subtitle: "PROPUESTA 2",
              description: "Una propuesta integral pensada para marcas que buscan contenido dinámico, cuidado estéticamente y alineado a tendencias actuales.",
              includes: [
                "2 Reels UGC de alto engagement",
                "3 a 5 historias en Instagram",
                "Idea creativa & desarrollo de guión",
                "Edición dinámica con hooks estratégicos y subtítulos",
                "Entrega final en formato listo para publicar"
              ],
              modality: "Producto + fee de creación de contenido",
              price: "Desde USD 180 + producto",
              highlightLabel: "Extra opcional:",
              highlightText: "Posibilidad de adaptar técnica y legalmente el contenido para campañas de anuncios pagos.",
              badge: "RECOMENDADO"
            },
            {
              id: 3,
              title: "PACK MENSUAL",
              subtitle: "PROPUESTA 3",
              description: "Pensado para marcas consolidadas que necesitan presencia constante y un flujo regular de videos de calidad para TikTok e Instagram.",
              includes: [
                "8 reels verticales por mes",
                "Historias semanales sobre backstage, productos o experiencia de marca",
                "Monitoreo de tendencias y bajada creativa",
                "Edición Premium, ganchos visuales y hooks estratégicos",
                "Entrega limpia organizada en carpetas de nube"
              ],
              modality: "Contratación mensual recurrente",
              price: "Desde USD 850 mensuales",
              highlightLabel: "Objetivo:",
              highlightText: "Garantizar constancia, fidelización de audiencia y material 100% orgánico para campañas publicitarias.",
              badge: "ESTRATÉGICO"
            }
          ].map((prop, idx) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-gray-dark/30 border border-gray-mid/30 hover:border-accent/40 rounded-2xl p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm relative group focus-within:ring-1 focus-within:ring-accent/40"
            >
              {/* Card Label Tag */}
              <div className="absolute top-6 right-6">
                <span className={`text-[9px] font-dm tracking-widest uppercase font-bold px-3 py-1 rounded-full border ${
                  prop.id === 2 
                    ? 'border-accent bg-accent/15 text-accent' 
                    : 'border-white/10 bg-white/5 text-cream/50'
                }`}>
                  {prop.badge}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-dm tracking-widest text-accent font-bold uppercase mb-2 block">
                  {prop.subtitle}
                </span>
                <h4 className="font-barlow text-2xl font-bold text-white uppercase tracking-wide mb-4 leading-tight group-hover:text-accent transition-colors duration-300">
                  {prop.title}
                </h4>
                <p className="font-dm text-xs md:text-sm text-cream/60 leading-relaxed mb-6 border-b border-gray-mid/10 pb-6">
                  {prop.description}
                </p>

                <div className="space-y-3.5 mb-8">
                  <span className="text-[10px] font-dm tracking-widest uppercase text-cream/40 block font-bold">
                    El plan incluye:
                  </span>
                  {prop.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span className="font-dm text-xs md:text-sm text-cream/80 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto border-t border-gray-mid/10 pt-6">
                {/* Modality Section */}
                <div className="mb-4">
                  <span className="text-[10px] font-dm tracking-widest uppercase text-cream/40 block">Modalidad</span>
                  <p className="font-dm text-xs md:text-sm font-bold text-cream mt-0.5">{prop.modality}</p>
                </div>

                {/* Price Section */}
                {prop.price && (
                  <div className="mb-5">
                    <span className="text-[10px] font-dm tracking-widest uppercase text-cream/40 block">Inversión</span>
                    <p className="font-barlow text-xl font-extrabold text-accent mt-0.5">{prop.price}</p>
                  </div>
                )}

                {/* Bottom specific comment */}
                <div className="bg-white/2 py-3 px-4 rounded-lg border border-white/5 mt-4">
                  <span className="text-[9px] font-dm tracking-widest uppercase font-bold text-accent block">
                    {prop.highlightLabel}
                  </span>
                  <p className="font-dm text-xs text-cream/60 mt-1 leading-relaxed">
                    {prop.highlightText}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Centered CTA button without the textual prompt card */}
        <div className="mt-8 flex justify-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-2 border-accent hover:bg-accent hover:text-black text-accent font-barlow font-bold uppercase tracking-widest text-sm px-14 py-6 transition-all hover:-translate-y-1 duration-300 rounded-sm interactive cursor-pointer"
          >
            {t('ugc.cta')}
          </a>
        </div>

      </div>
    </section>
  );
}
