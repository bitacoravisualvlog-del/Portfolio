// Envío de eventos a Google Analytics 4 (la etiqueta gtag se carga en index.html).
// Si Analytics no está disponible (bloqueador de anuncios, etc.), no hace nada.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  try {
    window.gtag?.('event', name, params);
  } catch {
    /* nunca rompe la web por un problema de medición */
  }
}
