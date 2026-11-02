import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Download, X } from 'lucide-react';
import type { Resource } from '../../data/resources';
import { leadService, getSavedLead, saveLeadLocally } from '../../services/leadService';

// Inicia la descarga del archivo sin salir de la página.
export function startDownload(resource: Resource) {
  const a = document.createElement('a');
  a.href = resource.file;
  a.download = resource.file.split('/').pop() || '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Guarda el lead sin frenar la descarga si Firestore tarda o falla.
export async function recordLead(resource: Resource, data: { name: string; email: string; marketingOptIn: boolean }) {
  const save = leadService.addLead({ ...data, resourceId: resource.id, resourceTitle: resource.title });
  const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
  try {
    await Promise.race([save, timeout]);
  } catch (error) {
    console.error('No se pudo guardar el lead', error);
  }
}

interface Props {
  resource: Resource | null;
  onClose: () => void;
}

export default function ResourceDownloadDialog({ resource, onClose }: Props) {
  const { t } = useTranslation();
  const { lang = 'es' } = useParams<{ lang: string }>();
  const saved = getSavedLead();
  const [name, setName] = useState(saved?.name || '');
  const [email, setEmail] = useState(saved?.email || '');
  const [optIn, setOptIn] = useState(saved?.marketingOptIn ?? false);
  const [status, setStatus] = useState<'form' | 'sending' | 'done'>('form');
  const emailRef = useRef<HTMLInputElement>(null);

  // Al abrir: reiniciar estado, enfocar el email, bloquear el scroll y cerrar con Escape.
  useEffect(() => {
    if (!resource) return;
    setStatus('form');
    const focusTimer = setTimeout(() => emailRef.current?.focus(), 50);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [resource, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource || !email) return;
    setStatus('sending');
    const data = { name, email, marketingOptIn: optIn };
    await recordLead(resource, data);
    saveLeadLocally(data);
    startDownload(resource);
    setStatus('done');
  };

  return (
    <AnimatePresence>
      {resource && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-dialog-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-gray-dark border border-gray-mid/30 sm:border-accent/40 p-6 sm:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t('resources.close', 'Cerrar')}
              className="absolute top-4 right-4 p-2 text-cream/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {status !== 'done' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3 pr-8">
                  <span className="text-[10px] font-dm uppercase tracking-widest text-accent">
                    {resource.type} · {t('resources.free', 'Gratis')}
                  </span>
                  <h3 id="resource-dialog-title" className="font-barlow text-2xl md:text-3xl text-cream uppercase leading-tight">
                    {resource.title}
                  </h3>
                  <p className="font-dm text-sm text-cream/60 leading-relaxed">
                    {t('resources.form_intro', 'Dejame tu email y la descarga empieza al instante.')}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="lead-email" className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">
                      Email *
                    </label>
                    <input
                      id="lead-email"
                      ref={emailRef}
                      type="email"
                      required
                      maxLength={100}
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-mid/40 py-3 font-dm text-cream focus:border-accent outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lead-name" className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">
                      {t('resources.name', 'Nombre')} <span className="normal-case tracking-normal">({t('resources.optional', 'opcional')})</span>
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      maxLength={100}
                      autoComplete="given-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-mid/40 py-3 font-dm text-cream focus:border-accent outline-none transition-colors"
                      placeholder={t('resources.name_placeholder', 'Tu nombre')}
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={optIn}
                      onChange={(e) => setOptIn(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-accent"
                    />
                    <span className="font-dm text-sm text-cream/70 leading-snug">
                      {t('resources.optin', 'Quiero recibir nuevos recursos y novedades de CREATE DIGITAL por email.')}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent-hover text-black px-8 py-4 font-barlow font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-60 interactive"
                >
                  <Download size={18} />
                  {status === 'sending' ? t('resources.preparing', 'Preparando…') : t('resources.download', 'Descargar gratis')}
                </button>

                <p className="font-dm text-[11px] text-cream/40 leading-relaxed">
                  {t('resources.privacy_note', 'Uso tus datos solo para enviarte este recurso y, si lo marcaste, novedades. Podés pedir la baja cuando quieras.')}{' '}
                  <Link to={`/${lang}/privacy`} onClick={onClose} className="underline hover:text-cream">
                    {t('footer.privacy', 'Política de privacidad')}
                  </Link>
                </p>
              </form>
            ) : (
              <div className="space-y-6 text-center py-6">
                <div className="mx-auto w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                  <Check size={28} />
                </div>
                <div className="space-y-3">
                  <h3 id="resource-dialog-title" className="font-bebas text-4xl text-white leading-none">
                    {t('resources.thanks', '¡Gracias! Tu descarga empezó')}
                  </h3>
                  <p className="font-dm text-sm text-cream/60">
                    {t('resources.fallback', '¿No arrancó?')}{' '}
                    <a href={resource.file} download className="text-accent underline underline-offset-4 hover:text-white">
                      {t('resources.fallback_link', 'Descargalo desde acá')}
                    </a>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-dm text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-white transition-colors"
                >
                  {t('resources.close', 'Cerrar')}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
