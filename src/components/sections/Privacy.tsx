import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'es';

  return (
    <div className="min-h-screen bg-black text-cream px-6 py-32 md:px-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link 
          to={`/${lang}`} 
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors font-dm uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} />
          {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </Link>
        
        <div className="space-y-4">
          <h1 className="font-bebas text-6xl md:text-8xl text-white leading-none">
            {t('footer.privacy')}
          </h1>
          <p className="font-dm text-cream/50 uppercase tracking-[0.4em] text-sm">
            CREATE DIGITAL · 2026
          </p>
        </div>

        <div className="font-dm text-cream/70 space-y-8 text-lg leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-sm border-l-2 border-accent pl-4">
              {lang === 'es' ? '1. Información que recopilamos' : '1. Information We Collect'}
            </h2>
            <p>
              {lang === 'es' 
                ? 'Este sitio es un portfolio profesional. No recopilamos datos personales a menos que decidas contactarnos voluntariamente a través de las opciones proporcionadas.' 
                : 'This site is a professional portfolio. We do not collect personal data unless you voluntarily choose to contact us through the provided options.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-sm border-l-2 border-accent pl-4">
              {lang === 'es' ? '2. Uso de la información' : '2. Use of Information'}
            </h2>
            <p>
              {lang === 'es'
                ? 'Cualquier información proporcionada se utilizará exclusivamente para responder a tus consultas profesionales.'
                : 'Any information provided will be used exclusively to respond to your professional inquiries.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-sm border-l-2 border-accent pl-4">
              {lang === 'es' ? '3. Cookies' : '3. Cookies'}
            </h2>
            <p>
              {lang === 'es'
                ? 'Podemos utilizar cookies técnicas esenciales para el funcionamiento básico del sitio y análisis de tráfico anónimo.'
                : 'We may use essential technical cookies for the basic functioning of the site and anonymous traffic analysis.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-sm border-l-2 border-accent pl-4">
              {lang === 'es' ? '4. Contacto' : '4. Contact'}
            </h2>
            <p>
              {lang === 'es'
                ? 'Para cualquier duda sobre esta política, podés escribir a: createdigital.mkt@gmail.com'
                : 'For any questions about this policy, you can write to: createdigital.mkt@gmail.com'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
