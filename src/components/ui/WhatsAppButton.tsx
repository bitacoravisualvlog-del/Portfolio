import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { trackEvent } from '../../lib/analytics';

// Enlace corto de WhatsApp Business: no muestra el número en la web.
// El mensaje que aparece ya escrito se configura en la app (Enlace corto → Mensaje predeterminado).
// Si se restablece el enlace en la app, hay que reemplazarlo acá.
const WHATSAPP_URL = 'https://wa.me/message/NUIISKY6VERGO1';

export default function WhatsAppButton() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  // En el panel de admin no hace falta
  if (pathname.includes('/admin')) return null;

  const label = t('whatsapp.label', 'Escribinos por WhatsApp');

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={() => trackEvent('whatsapp_click', { page: pathname })}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      className="interactive fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 group"
    >
      {/* Halo que late suave para llamar la atención */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2.5s]" aria-hidden="true" />
      <span className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 32 32" className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" aria-hidden="true">
          <path d="M16.004 3C9.375 3 3.98 8.39 3.977 15.02c0 2.12.553 4.19 1.605 6.01L3.875 28.2l7.345-1.926a12.98 12.98 0 0 0 6.78 1.73h.005c6.628 0 12.023-5.39 12.026-12.02.002-3.212-1.247-6.232-3.517-8.504A11.95 11.95 0 0 0 16.004 3Zm0 21.97h-.004a10.79 10.79 0 0 1-5.5-1.506l-.395-.234-4.085 1.07 1.09-3.98-.257-.408a10.75 10.75 0 0 1-1.65-5.74c.003-5.95 4.846-10.79 10.805-10.79 2.885 0 5.597 1.125 7.636 3.166a10.72 10.72 0 0 1 3.16 7.63c-.003 5.95-4.846 10.792-10.8 10.792Zm5.923-8.08c-.325-.162-1.922-.948-2.22-1.056-.297-.108-.514-.162-.73.163-.217.324-.839 1.055-1.028 1.272-.19.216-.379.243-.703.081-.325-.162-1.372-.506-2.613-1.613-.966-.861-1.618-1.925-1.808-2.25-.19-.324-.02-.5.142-.661.146-.145.325-.379.487-.568.163-.19.217-.325.325-.541.108-.217.054-.406-.027-.568-.081-.162-.73-1.758-1-2.407-.264-.632-.532-.546-.73-.556l-.622-.011a1.19 1.19 0 0 0-.866.406c-.297.325-1.136 1.11-1.136 2.705 0 1.596 1.163 3.138 1.325 3.354.162.217 2.289 3.494 5.546 4.9.775.335 1.38.535 1.851.685.778.247 1.486.212 2.046.129.624-.093 1.922-.786 2.193-1.545.27-.758.27-1.408.19-1.544-.082-.135-.298-.216-.623-.379Z" />
        </svg>
      </span>
    </motion.a>
  );
}
