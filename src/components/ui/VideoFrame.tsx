import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, VolumeX, Sparkles } from 'lucide-react';

// Video con tapa, botón de play y sonido. Lo usan las secciones UGC y Contenido con IA.
export interface VideoItem {
  id: string;
  badge: string;
  titleKey: string;
  descKey: string;
  video: string;
  poster: string;
  agency?: { name: string; url: string };
  format?: 'vertical' | 'horizontal';  // por defecto vertical (9:16)
  noteKey?: string;                     // aclaración debajo de la descripción
}

interface Props {
  item: VideoItem;
  isPlaying: boolean;
  muted: boolean;
  onToggle: () => void;
  onMuteToggle: (e: React.MouseEvent) => void;
  onEnded: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
  className?: string;
}

export default function VideoFrame({ item, isPlaying, muted, onToggle, onMuteToggle, onEnded, videoRef, className = '' }: Props) {
  const { t } = useTranslation();
  const horizontal = item.format === 'horizontal';

  return (
    <div
      onClick={onToggle}
      className={`relative w-full mx-auto bg-gray-dark border border-gray-mid/60 hover:border-accent/40 overflow-hidden cursor-pointer group shadow-2xl transition-all duration-500 ${horizontal ? 'aspect-video rounded-2xl' : 'aspect-[9/16] max-w-sm rounded-3xl'} ${className}`}
    >
      {/* Isla del celular (solo formato vertical) */}
      {!horizontal && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-lg z-30 flex items-center justify-center opacity-80 border border-gray-mid/20">
          <div className="w-2 h-2 rounded-full bg-gray-dark" />
        </div>
      )}

      <video
        ref={videoRef}
        src={item.video}
        poster={item.poster}
        preload="none"
        loop
        playsInline
        muted={muted}
        onEnded={onEnded}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-[0.85] group-hover:brightness-100"
      />

      {/* Tapa mientras no se reproduce */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#0D0D0D] z-10 overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
              style={{ backgroundImage: `url(${item.poster})` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Degradado para leer los textos */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Marca */}
      <div className={`absolute ${horizontal ? 'top-4 left-4 md:top-5 md:left-6' : 'top-10 left-6'} z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-mid/40`}>
        <Sparkles size={12} className="text-accent" />
        <span className="font-dm text-[10px] md:text-[11px] uppercase tracking-widest text-[#FFF]">{item.badge}</span>
      </div>

      {/* Sonido (solo mientras se reproduce) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMuteToggle}
            className={`absolute ${horizontal ? 'top-4 right-4 md:top-5 md:right-6' : 'top-10 right-6'} z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 backdrop-blur-md flex items-center justify-center border border-gray-mid/30 text-cream hover:text-accent transition-all duration-300`}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Botón de play */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-14 h-14 rounded-full bg-accent/90 text-black flex items-center justify-center pl-1 shadow-lg shadow-accent/20 border border-white/10"
            >
              <Play size={20} fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detalle que aparece al reproducir (solo en el formato vertical) */}
      <AnimatePresence>
        {isPlaying && !horizontal && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-6 left-6 right-6 z-20"
          >
            {item.agency && (
              <span className="text-[10px] uppercase tracking-widest font-bold text-accent mb-2 block">
                {t('ugc.agency')}
                <a
                  href={item.agency.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="underline text-white hover:text-accent transition-colors ml-1 font-extrabold"
                >
                  {item.agency.name}
                </a>
              </span>
            )}
            <h3 className="font-bebas text-2xl text-white mb-2 leading-tight tracking-wider">
              {t(item.titleKey)}
            </h3>
            <p className="font-dm text-cream/70 text-xs leading-relaxed line-clamp-3">
              {t(item.descKey)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Estado compartido de reproducción: un solo video sonando a la vez dentro de la sección.
export function useVideoPlayback() {
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const [mutedStates, setMutedStates] = React.useState<Record<string, boolean>>({});
  const refs = React.useRef<Record<string, HTMLVideoElement | null>>({});

  const isMuted = (id: string) => mutedStates[id] ?? true;

  const toggle = (id: string) => {
    const video = refs.current[id];
    if (!video) return;
    if (playingId === id) {
      video.pause();
      setPlayingId(null);
      return;
    }
    if (playingId) refs.current[playingId]?.pause();
    video.play().then(() => setPlayingId(id)).catch(() => {
      // Si el navegador bloquea el audio, reproduce en silencio
      video.muted = true;
      setMutedStates(prev => ({ ...prev, [id]: true }));
      video.play().then(() => setPlayingId(id)).catch(() => {});
    });
  };

  const toggleMute = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const video = refs.current[id];
    if (!video) return;
    const next = !isMuted(id);
    video.muted = next;
    setMutedStates(prev => ({ ...prev, [id]: next }));
  };

  const frameProps = (id: string) => ({
    isPlaying: playingId === id,
    muted: isMuted(id),
    onToggle: () => toggle(id),
    onMuteToggle: (e: React.MouseEvent) => toggleMute(e, id),
    onEnded: () => setPlayingId(null),
    videoRef: (el: HTMLVideoElement | null) => { refs.current[id] = el; },
  });

  return { frameProps };
}
