import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Film } from 'lucide-react';

interface VideoItem {
  id: number;
  titleKey: string;
  descKey: string;
  brandBadge: string;
  poster: string;
}

export default function UGC() {
  const { t } = useTranslation();
  
  const [videos] = useState<VideoItem[]>([
    {
      id: 1,
      titleKey: 'ugc.loreal1',
      descKey: 'ugc.desc1',
      brandBadge: 'VICHY',
      poster: 'https://images.boots.com/is/image/Boots/10303102'
    },
    {
      id: 2,
      titleKey: 'ugc.loreal2',
      descKey: 'ugc.desc2',
      brandBadge: 'LA ROCHE-POSAY',
      poster: 'https://images.boots.com/is/image/Boots/10313233'
    }
  ]);

  // Active video source state (defaults to premium vertical stock beauty showcase files)
  const [activeSources, setActiveSources] = useState<{ [key: number]: string }>({
    1: 'https://assets.mixkit.co/videos/preview/mixkit-skin-cream-being-applied-to-a-womans-hand-44140-large.mp4',
    2: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-applying-facial-cream-and-smiling-41581-large.mp4'
  });

  // Active custom covers state (automatically detected if uploaded in public)
  const [activePosters, setActivePosters] = useState<{ [key: number]: string | null }>({
    1: null,
    2: null
  });

  // Check if user uploaded any custom videos or custom covers in the background
  useEffect(() => {
    const detectUploadedAssets = async () => {
      // 1. Check for custom videos
      const pathsToCheck = [
        { id: 1, path: '/loreal1.mp4' },
        { id: 2, path: '/loreal2.mp4' }
      ];

      for (const item of pathsToCheck) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);

          const res = await fetch(item.path, {
            method: 'HEAD',
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            // Make sure it's a real video stream
            if (contentType.includes('video') || (!contentType.includes('html') && !contentType.includes('xml'))) {
              console.log(`UGC Component: Detected custom video stream for ID ${item.id} at ${item.path}`);
              setActiveSources(prev => ({
                ...prev,
                [item.id]: item.path
              }));
            }
          }
        } catch (e) {
          // Ignore fetch fails
        }
      }

      // 2. Check for custom covers/posters in public using native Image loaders for 100% mobile compatibility
      const posterExtensions = ['png', 'jpg', 'jpeg', 'webp'];
      for (const id of [1, 2]) {
        const tryLoadPoster = (index: number) => {
          if (index >= posterExtensions.length) return;
          const ext = posterExtensions[index];
          const path = `/loreal${id}.${ext}`;
          
          const img = new Image();
          img.onload = () => {
            console.log(`UGC Component: Detected custom cover via Image loader for ID ${id} at ${path}`);
            setActivePosters(prev => ({ ...prev, [id]: path }));
          };
          img.onerror = () => {
            tryLoadPoster(index + 1);
          };
          img.src = path;
        };
        tryLoadPoster(0);
      }
    };

    detectUploadedAssets();
  }, []);

  // Video controller states
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true
  });

  const videoRefs = {
    1: useRef<HTMLVideoElement>(null),
    2: useRef<HTMLVideoElement>(null)
  };

  const handlePlayToggle = (id: number) => {
    const video = videoRefs[id as 1 | 2].current;
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause other video if playing
      if (playingId && playingId !== id) {
        const otherVideo = videoRefs[playingId as 1 | 2].current;
        if (otherVideo) otherVideo.pause();
      }
      
      // Attempt play with modern browser handling
      video.play().then(() => {
        setPlayingId(id);
      }).catch(err => {
        console.log('Video play failed, retrying to play muted:', err);
        // Force muted play if browser block active
        video.muted = true;
        setMutedStates(prev => ({ ...prev, [id]: true }));
        video.play().then(() => {
          setPlayingId(id);
        });
      });
    }
  };

  const handleMuteToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // prevent play/pause toggle
    const video = videoRefs[id as 1 | 2].current;
    if (!video) return;

    const currentMuted = !mutedStates[id];
    video.muted = currentMuted;
    setMutedStates(prev => ({ ...prev, [id]: currentMuted }));
  };

  return (
    <section id="ugc" className="py-24 px-6 md:px-12 bg-black relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 md:mb-20">
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

        {/* Vertical Video Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {videos.map((item) => {
            const isPlaying = playingId === item.id;
            const isMuted = mutedStates[item.id];
            const ref = videoRefs[item.id as 1 | 2];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: item.id * 0.15 }}
                className="flex flex-col"
              >
                {/* Smartphone-like vertical frame container */}
                <div 
                  onClick={() => handlePlayToggle(item.id)}
                  className="relative aspect-[9/16] w-full max-w-sm mx-auto bg-gray-dark border border-gray-mid/60 hover:border-accent/40 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl transition-all duration-500"
                >
                  {/* Decorative phone notch/island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-lg z-30 flex items-center justify-center opacity-80 border border-gray-mid/20">
                    <div className="w-2 h-2 rounded-full bg-gray-dark" />
                  </div>

                   {/* HTML5 Video Player */}
                  <video
                    ref={ref}
                    key={`${item.id}-${activeSources[item.id] || ''}`}
                    src={activeSources[item.id]}
                    poster={item.poster}
                    loop
                    playsInline
                    muted={isMuted}
                    onError={() => {
                      const currentSrc = activeSources[item.id];
                      // If the local file failed to load, fall back seamlessly to the premium HD streams
                      if (currentSrc && !currentSrc.startsWith('https://')) {
                        const fallbackUrl = item.id === 1
                          ? 'https://assets.mixkit.co/videos/preview/mixkit-skin-cream-being-applied-to-a-womans-hand-44140-large.mp4'
                          : 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-applying-facial-cream-and-smiling-41581-large.mp4';
                        
                        setActiveSources(prev => ({
                          ...prev,
                          [item.id]: fallbackUrl
                        }));

                        // Auto-resume play
                        setTimeout(() => {
                          const activeVideo = ref.current;
                          if (activeVideo && playingId === item.id) {
                            activeVideo.play().catch(() => {});
                          }
                        }, 50);
                      }
                    }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-[0.85] group-hover:brightness-100"
                  />

                  {/* High Quality Real Product Poster Overlay - Dark & Textured like Projects without images */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-[#0D0D0D] flex flex-col justify-between p-8 z-10 overflow-hidden"
                      >
                        {activePosters[item.id] ? (
                          /* Custom Cover Image Background with grayscale-to-color transition on hover */
                          <div 
                            className="absolute inset-0 bg-cover bg-center opacity-100 grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                            style={{ backgroundImage: `url(${activePosters[item.id]})` }}
                          />
                        ) : (
                          <>
                            {/* Dot Texture Background identical to Projects section */}
                            <div className="absolute inset-0 bg-[radial-gradient(var(--color-accent)_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
                            
                            {/* Soft elegant radial brand glow */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none ${
                              item.id === 1 ? 'bg-[#9c1c1c]' : 'bg-[#e05615]'
                            }`} />

                            <div className="h-4" />

                            {/* Centered Large Cover Text (Aesthetic Large Stylized Typography) */}
                            <div className="relative flex-1 flex flex-col items-center justify-center p-4 text-center select-none pointer-events-none z-10">
                              <h3 className="font-bebas text-5xl transition-all duration-700 uppercase tracking-tighter leading-none whitespace-pre-line text-white/5 group-hover:text-accent/25">
                                {item.id === 1 ? "Vichy\nLiftactiv" : "La Roche\nAnthelios"}
                              </h3>
                            </div>

                            {/* Premium brand labels bottom aligned inside poster */}
                            <div className="relative z-10 text-center mb-10">
                              <span className="text-[9px] font-dm tracking-widest uppercase font-bold px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent inline-block mb-3.5 shadow-sm">
                                {item.id === 1 ? 'Vichy Liftactiv B3' : 'La Roche-Posay Anthelios'}
                              </span>
                              <h4 className="font-bebas text-4xl text-cream group-hover:text-white transition-colors duration-500 tracking-wide uppercase leading-tight font-medium">
                                {item.id === 1 ? 'Collagen Specialist' : 'UVmune 400 SPF 50+'}
                              </h4>
                              <p className="font-dm text-cream/40 text-[10px] tracking-widest uppercase mt-1">
                                {item.id === 1 ? 'SERUM ANTIMANCHAS / COLLAGEN BOND' : 'FLUIDO INVISIBLE DE ALTA PROTECCION'}
                              </p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Gradient Overlay for labels & readability when playing */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300 z-10 pointer-events-none" />

                  {/* Top Agency Badge */}
                  <div className="absolute top-10 left-6 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-mid/40">
                    <Sparkles size={12} className="text-accent" />
                    <span className="font-dm text-[11px] uppercase tracking-widest text-[#FFF]">{item.brandBadge}</span>
                  </div>

                  {/* Sound Controller Button (Only visible during active playback) */}
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => handleMuteToggle(e, item.id)}
                        className="absolute top-10 right-6 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 backdrop-blur-md flex items-center justify-center border border-gray-mid/30 text-cream hover:text-accent transition-all duration-300"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Visual UI Play State Indicators */}
                  <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
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

                  {/* Bottom details card (native style) - Slides in beautifully when active */}
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bottom-6 left-6 right-6 z-20"
                      >
                        <span className="text-[10px] uppercase tracking-widest font-bold text-accent mb-2 block">
                          {t('ugc.agency')}
                          <a 
                            href="https://www.wildfi.com/es/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="underline text-white hover:text-accent transition-colors ml-1 font-extrabold"
                          >
                            WILDFI
                          </a>
                        </span>
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

                {/* Information Card underneath the smartphone */}
                <div className="mt-8 text-center px-4 max-w-sm mx-auto w-full group/info">
                  <h3 className="font-barlow text-2xl text-cream group-hover/info:text-accent font-bold uppercase tracking-wide transition-colors duration-300">
                    {t(item.titleKey)}
                  </h3>
                  
                  {/* Agency Link & Collaboration details */}
                  <div className="mt-2.5 flex items-center justify-center gap-1 text-xs">
                    <span className="font-dm text-cream/40 uppercase tracking-widest text-[10px]">
                      {t('ugc.agency')}
                    </span>
                    <a 
                      href="https://www.wildfi.com/es/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-dm text-accent hover:text-white underline font-extrabold uppercase tracking-widest text-[10px] transition-colors duration-300"
                    >
                      WILDFI
                    </a>
                  </div>

                  <p className="font-dm text-sm text-cream/60 leading-relaxed mt-4">
                    {t(item.descKey)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Proposals / Collaborations Section */}
        <div className="mt-32 mb-16 text-center">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24 items-stretch px-4">
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
