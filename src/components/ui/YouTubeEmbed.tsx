import { useState } from 'react';
import { Play } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

// Video de YouTube con tapa liviana: el reproductor real se carga al tocar play,
// así la página no se pone lenta y la reproducción la inicia la persona,
// que es como YouTube cuenta las visualizaciones.
interface Props {
  videoId: string;
  title: string;
}

export default function YouTubeEmbed({ videoId, title }: Props) {
  const [active, setActive] = useState(false);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  // enablejsapi permite que Google Analytics registre inicio y avance del video.
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-mid/40 bg-gray-dark shadow-2xl">
      {active ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => { setActive(true); trackEvent('youtube_play', { video_id: videoId, video_title: title }); }}
          aria-label={`Reproducir: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <img
            src={thumb}
            alt=""
            loading="lazy"
            onLoad={(e) => {
              // YouTube devuelve una imagen gris de 120 px si no existe la versión en alta
              if ((e.target as HTMLImageElement).naturalWidth < 200) setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
            }}
            onError={() => setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent/95 pl-1 text-black shadow-lg shadow-accent/30 transition-transform duration-300 group-hover:scale-110">
            <Play size={24} fill="currentColor" />
          </span>
          <span className="absolute bottom-4 left-5 right-5 text-left font-dm text-xs md:text-sm text-cream/90">
            ▶ {title}
          </span>
        </button>
      )}
    </div>
  );
}
