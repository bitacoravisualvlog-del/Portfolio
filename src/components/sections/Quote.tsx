import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Send, CircleCheck } from 'lucide-react';
import { QUOTE_GROUPS, GOALS, TIMELINES, BUDGETS } from '../../data/quoteOptions';
import { quoteService } from '../../services/quoteService';
import { trackEvent } from '../../lib/analytics';

const inputClass =
  'w-full bg-transparent border-b border-gray-mid/40 py-3 font-dm text-cream placeholder:text-cream/55 focus:border-accent outline-none transition-colors';
const labelClass = 'text-[10px] uppercase tracking-widest text-cream/65 font-dm';

// Espera una promesa como máximo `ms` milisegundos (para no dejar a nadie esperando).
const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<'timeout'>(resolve => setTimeout(() => resolve('timeout'), ms))]);

export default function Quote() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState<string | null>(QUOTE_GROUPS[0].id);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business: '', industry: '', website: '',
    goal: '', timeline: '', budget: '', details: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [needServices, setNeedServices] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const toggle = (name: string) => {
    setNeedServices(false);
    setSelected(prev => (prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      setNeedServices(true);
      document.getElementById('presupuesto-servicios')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStatus('sending');
    const input = { ...form, services: selected, lang: i18n.language?.slice(0, 2) || 'es' };

    // Se guarda en tu panel y se manda el aviso por mail; alcanza con que funcione uno.
    const [saved, mailed] = await Promise.allSettled([
      withTimeout(quoteService.addQuote(input), 8000),
      withTimeout(quoteService.notify(input), 8000),
    ]);
    const savedOk = saved.status === 'fulfilled' && saved.value !== 'timeout';
    const mailedOk = mailed.status === 'fulfilled' && mailed.value === true;

    if (savedOk || mailedOk) {
      trackEvent('generate_lead', { lead_source: 'quote_form', services_count: selected.length });
      setStatus('done');
      setSelected([]);
      setForm({ name: '', email: '', phone: '', business: '', industry: '', website: '', goal: '', timeline: '', budget: '', details: '' });
      document.getElementById('presupuesto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setStatus('error');
    }
  };

  return (
    <section id="presupuesto" className="py-16 md:py-32 px-6 md:px-12 bg-black border-t border-gray-mid/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[420px] h-[420px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Encabezado */}
        <div className="mb-10 md:mb-16">
          <span className="block text-xs font-dm uppercase tracking-widest text-accent mb-4">
            {t('quote.eyebrow', 'Presupuesto personalizado')}
          </span>
          <h2 className="font-bebas text-5xl md:text-8xl text-white leading-none tracking-tight">
            {t('quote.title', 'Pedí tu presupuesto')}
          </h2>
          <p className="font-dm text-sm md:text-base text-cream/55 leading-relaxed mt-4 max-w-2xl">
            {t('quote.intro', 'Contame qué necesitás y armo una propuesta a medida de tu negocio. Marcá los servicios que te interesan, completá unos datos básicos y te respondo con el presupuesto.')}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'done' ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-accent/40 bg-gray-dark/40 p-8 md:p-14 text-center space-y-5"
            >
              <CircleCheck size={48} className="mx-auto text-accent" />
              <h3 className="font-bebas text-4xl md:text-5xl text-white">{t('quote.thanks_title', '¡Recibí tu pedido!')}</h3>
              <p className="font-dm text-cream/65 max-w-xl mx-auto leading-relaxed">
                {t('quote.thanks_body', 'Voy a revisar lo que necesitás y te envío un presupuesto personalizado por mail o WhatsApp. Respondo de lunes a viernes de 9 a 17 h.')}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="font-dm text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-accent transition-colors"
              >
                {t('quote.another', 'Hacer otro pedido')}
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-14">
              {/* 1 · Servicios */}
              <div id="presupuesto-servicios" className="space-y-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-barlow font-bold text-lg md:text-xl uppercase tracking-[0.15em] text-cream">
                    <span className="text-accent">01 · </span>{t('quote.step1', '¿Qué servicios necesitás?')}
                  </h3>
                  <span className={`font-dm text-xs uppercase tracking-widest ${selected.length ? 'text-accent' : 'text-cream/55'}`}>
                    {selected.length} {selected.length === 1 ? t('quote.selected_one', 'seleccionado') : t('quote.selected_many', 'seleccionados')}
                  </span>
                </div>
                {needServices && (
                  <p className="font-dm text-sm text-accent">{t('quote.need_services', 'Marcá al menos un servicio para poder cotizarte.')}</p>
                )}

                <div className={`border divide-y divide-gray-mid/20 ${needServices ? 'border-accent/60' : 'border-gray-mid/25'}`}>
                  {QUOTE_GROUPS.map(group => {
                    const count = group.options.filter(o => selected.includes(o.name)).length;
                    const isOpen = open === group.id;
                    return (
                      <div key={group.id}>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : group.id)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left hover:bg-gray-dark/40 transition-colors"
                        >
                          <span className="font-barlow font-semibold text-base md:text-lg uppercase tracking-wide text-cream">
                            {group.title}
                          </span>
                          <span className="flex items-center gap-3 shrink-0">
                            {count > 0 && (
                              <span className="font-dm text-[10px] uppercase tracking-widest bg-accent text-black px-2 py-0.5">{count}</span>
                            )}
                            <ChevronDown size={18} className={`text-cream/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="grid sm:grid-cols-2 gap-2 px-4 md:px-5 pb-5">
                                {group.options.map(option => {
                                  const checked = selected.includes(option.name);
                                  return (
                                    <label
                                      key={option.id}
                                      className={`flex gap-3 p-3 md:p-4 border cursor-pointer transition-colors ${checked ? 'border-accent bg-accent/10' : 'border-gray-mid/20 hover:border-gray-mid/50'}`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggle(option.name)}
                                        className="sr-only"
                                      />
                                      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${checked ? 'bg-accent border-accent text-black' : 'border-cream/40'}`}>
                                        {checked && <Check size={12} strokeWidth={3} />}
                                      </span>
                                      <span className="space-y-1">
                                        <span className="block font-dm text-sm text-cream leading-snug">{option.name}</span>
                                        <span className="block font-dm text-xs text-cream/65 leading-snug">{option.detail}</span>
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2 · Negocio */}
              <div className="space-y-6">
                <h3 className="font-barlow font-bold text-lg md:text-xl uppercase tracking-[0.15em] text-cream">
                  <span className="text-accent">02 · </span>{t('quote.step2', 'Contame sobre tu negocio')}
                </h3>
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                  <div className="space-y-1">
                    <label htmlFor="q-business" className={labelClass}>{t('quote.business', 'Nombre del negocio o marca')}</label>
                    <input id="q-business" required maxLength={120} value={form.business} onChange={set('business')} className={inputClass} placeholder="Ej: Estudio Martínez" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-industry" className={labelClass}>{t('quote.industry', 'Rubro')}</label>
                    <input id="q-industry" required maxLength={120} value={form.industry} onChange={set('industry')} className={inputClass} placeholder="Ej: estética, gastronomía, e-commerce" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-website" className={labelClass}>{t('quote.website', 'Web o Instagram (opcional)')}</label>
                    <input id="q-website" maxLength={200} value={form.website} onChange={set('website')} className={inputClass} placeholder="@tumarca o tumarca.com" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-goal" className={labelClass}>{t('quote.goal', '¿Qué querés lograr?')}</label>
                    <select id="q-goal" required value={form.goal} onChange={set('goal')} className={`${inputClass} bg-black`}>
                      <option value="" disabled>{t('quote.choose', 'Elegí una opción')}</option>
                      {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-timeline" className={labelClass}>{t('quote.timeline', '¿Para cuándo lo necesitás?')}</label>
                    <select id="q-timeline" required value={form.timeline} onChange={set('timeline')} className={`${inputClass} bg-black`}>
                      <option value="" disabled>{t('quote.choose', 'Elegí una opción')}</option>
                      {TIMELINES.map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-budget" className={labelClass}>{t('quote.budget', 'Presupuesto aproximado (opcional)')}</label>
                    <select id="q-budget" value={form.budget} onChange={set('budget')} className={`${inputClass} bg-black`}>
                      <option value="">{t('quote.choose', 'Elegí una opción')}</option>
                      {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="q-details" className={labelClass}>{t('quote.details', 'Contame un poco más (opcional)')}</label>
                    <textarea
                      id="q-details"
                      rows={3}
                      maxLength={2000}
                      value={form.details}
                      onChange={set('details')}
                      className={`${inputClass} resize-none`}
                      placeholder={t('quote.details_ph', 'Qué vendés, a quién, qué hacés hoy en redes o publicidad y qué te gustaría mejorar.')}
                    />
                  </div>
                </div>
              </div>

              {/* 3 · Contacto */}
              <div className="space-y-6">
                <h3 className="font-barlow font-bold text-lg md:text-xl uppercase tracking-[0.15em] text-cream">
                  <span className="text-accent">03 · </span>{t('quote.step3', '¿Cómo te contacto?')}
                </h3>
                <div className="grid md:grid-cols-3 gap-x-10 gap-y-6">
                  <div className="space-y-1">
                    <label htmlFor="q-name" className={labelClass}>{t('quote.name', 'Tu nombre')}</label>
                    <input id="q-name" required maxLength={100} autoComplete="name" value={form.name} onChange={set('name')} className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-email" className={labelClass}>Email</label>
                    <input id="q-email" type="email" required maxLength={100} autoComplete="email" value={form.email} onChange={set('email')} className={inputClass} placeholder="tu@email.com" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-phone" className={labelClass}>{t('quote.phone', 'WhatsApp (opcional)')}</label>
                    <input id="q-phone" type="tel" maxLength={40} autoComplete="tel" value={form.phone} onChange={set('phone')} className={inputClass} placeholder="+54 9 11 …" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="interactive inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent-hover text-black px-10 py-5 font-barlow font-bold uppercase tracking-widest text-sm transition-all hover:-translate-y-1 duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <Send size={18} />
                  {status === 'sending' ? t('quote.sending', 'Enviando…') : t('quote.submit', 'Cotizar')}
                </button>
                <p className="font-dm text-xs text-cream/60 leading-relaxed max-w-md">
                  {status === 'error'
                    ? <span className="text-accent">{t('quote.error', 'No se pudo enviar. Probá de nuevo o escribime por WhatsApp.')}</span>
                    : t('quote.note', 'Sin compromiso. Te respondo con una propuesta a medida, de lunes a viernes de 9 a 17 h.')}
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
