import { useTranslation } from 'react-i18next';

// Banda corta con "Pedí tu presupuesto" que se repite a lo largo de la home.
export default function QuoteCTA({ textKey, fallback }: { textKey: string; fallback: string }) {
  const { t } = useTranslation();
  const goToQuote = () => document.getElementById('presupuesto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <div className="px-6 md:px-12 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 border border-accent/30 bg-gray-dark/30 p-7 md:p-10">
        <p className="font-bebas text-3xl md:text-4xl text-white leading-tight">{t(textKey, fallback)}</p>
        <button
          type="button"
          onClick={goToQuote}
          className="interactive inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent-hover text-black px-8 py-4 font-barlow font-bold uppercase tracking-widest text-sm transition-all hover:-translate-y-1 duration-300 shrink-0"
        >
          {t('quote.hero_cta', 'Pedí tu presupuesto')} →
        </button>
      </div>
    </div>
  );
}
