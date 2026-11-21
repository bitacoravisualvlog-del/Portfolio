import { useState } from 'react';

// Video que no se reproduce solo: arranca cuando la persona toca play.
// Como los videos de UGC, la tapa está en blanco y negro y toma color al pasar el mouse o al reproducir.
export default function PosterVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <video
      className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ${playing ? '' : 'grayscale brightness-[0.85] hover:grayscale-0 hover:brightness-100'}`}
      src={src}
      poster={poster}
      controls
      playsInline
      preload="none"
      aria-label={label}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)}
    />
  );
}
