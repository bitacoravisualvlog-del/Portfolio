import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Wand2 } from 'lucide-react';
import VideoFrame, { type VideoItem, useVideoPlayback } from '../ui/VideoFrame';

// Spec ads creados con herramientas de IA.
// Para sumar uno: subí el video y su tapa a /public y agregá un objeto acá (textos en src/messages, dentro de "ugc").
// Los horizontales se muestran a todo el ancho; los verticales, con el texto al costado.
const AI_ITEMS: VideoItem[] = [
  {
    id: 'spec-plusbelle',
    badge: 'SPEC AD · PLUSBELLE',
    titleKey: 'ugc.spec_plusbelle',
    descKey: 'ugc.desc_spec_plusbelle',
    video: '/spec-ad-plusbelle.mp4',
    poster: '/spec-ad-plusbelle.webp',
    format: 'horizontal',
    noteKey: 'ugc.spec_note',
  },
  {
    id: 'spec-mostaza',
    badge: 'SPEC AD · MOSTAZA',
    titleKey: 'ugc.spec_mostaza',
    descKey: 'ugc.desc_spec_mostaza',
    video: '/spec-ad-mostaza.mp4',
    poster: '/spec-ad-mostaza.webp',
    noteKey: 'ugc.spec_note',
  },
];

export default function AIContent() {
  const { t } = useTranslation();
  const { frameProps } = useVideoPlayback();

  // Textos de cada pieza: formato, título, descripción y aclaración
  const Info = ({ item, formatKey, formatFallback }: { item: VideoItem; formatKey: string; formatFallback: string }) => (
    <div className="space-y-4">
      <span className="block font-dm text-[10px] uppercase tracking-[0.3em] text-accent">
        {t(formatKey, formatFallback)}
      </span>
      <h3 className="font-barlow text-3xl md:text-4xl text-cream font-bold uppercase tracking-wide leading-tight">
        {t(item.titleKey)}
      </h3>
      <p className="font-dm text-sm md:text-base text-cream/60 leading-relaxed">
        {t(item.descKey)}
      </p>
      {item.noteKey && (
        <p className="font-dm text-[11px] text-cream/35 italic">{t(item.noteKey)}</p>
      )}
    </div>
  );

  return (
    <section id="contenido-ia" className="py-16 md:py-32 px-6 md:px-12 bg-black border-t border-gray-mid/10 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[380px] h-[380px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
          <div>
            <div className="flex items-center gap-2 text-accent mb-4">
              <Wand2 size={18} />
              <span className="text-xs font-dm uppercase tracking-widest">{t('ugc.ai_eyebrow', 'Spec ads · Inteligencia artificial')}</span>
            </div>
            <h2 className="font-bebas text-5xl md:text-8xl text-white leading-none tracking-tight">
              {t('ugc.ai_title', 'Contenido con IA')}
            </h2>
          </div>
          <p className="font-dm text-sm text-cream/50 leading-relaxed max-w-sm md:text-right">
            {t('ugc.ai_intro', 'Piezas publicitarias conceptuales creadas con herramientas de IA: de la idea y el guion a la imagen, la animación y la edición final.')}
          </p>
        </div>

        <div className="space-y-20 md:space-y-28">
          {AI_ITEMS.map((item, index) => {
            const horizontal = item.format === 'horizontal';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {horizontal ? (
                  // Horizontal: video a todo el ancho y el texto debajo, en dos columnas
                  <div className="space-y-8 md:space-y-10">
                    <VideoFrame item={item} {...frameProps(item.id)} />
                    <div className="grid md:grid-cols-[1fr_1.4fr] gap-4 md:gap-12 items-start">
                      <div className="space-y-4">
                        <span className="block font-dm text-[10px] uppercase tracking-[0.3em] text-accent">
                          {t('ugc.format_h', 'Formato horizontal · 16:9 · YouTube y web')}
                        </span>
                        <h3 className="font-barlow text-3xl md:text-4xl text-cream font-bold uppercase tracking-wide leading-tight">
                          {t(item.titleKey)}
                        </h3>
                      </div>
                      <div className="space-y-4 md:pt-7">
                        <p className="font-dm text-sm md:text-base text-cream/60 leading-relaxed">{t(item.descKey)}</p>
                        {item.noteKey && <p className="font-dm text-[11px] text-cream/35 italic">{t(item.noteKey)}</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Vertical: celular a la izquierda y el texto al costado
                  <div className="grid md:grid-cols-[minmax(0,340px)_1fr] gap-10 md:gap-16 items-center">
                    <VideoFrame item={item} {...frameProps(item.id)} />
                    <Info item={item} formatKey="ugc.format_v" formatFallback="Formato vertical · 9:16 · Reels y TikTok" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
