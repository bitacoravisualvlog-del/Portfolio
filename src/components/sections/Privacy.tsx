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
                ? 'Este sitio es un portfolio profesional. Solo recopilamos los datos que nos das voluntariamente: al escribirnos por el formulario de contacto, o tu email y, si querés, tu nombre al descargar un recurso gratuito.' 
                : 'This site is a professional portfolio. We only collect the data you voluntarily provide: when you write to us through the contact form, or your email and, optionally, your name when you download a free resource.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-sm border-l-2 border-accent pl-4">
              {lang === 'es' ? '2. Uso de la información' : '2. Use of Information'}
            </h2>
            <p>
              {lang === 'es'
                ? 'Usamos tus datos para responder tus consultas y para enviarte los recursos que descargaste. Solo te enviamos novedades y nuevos recursos por email si lo aceptaste expresamente, y podés pedir la baja o la eliminación de tus datos cuando quieras escribiendo a createdigital.mkt@gmail.com. No compartimos ni vendemos tus datos a terceros.'
                : 'We use your data to answer your inquiries and to deliver the resources you downloaded. We only send you news and new resources by email if you expressly agreed to it, and you can unsubscribe or ask for your data to be deleted at any time by writing to createdigital.mkt@gmail.com. We do not share or sell your data to third parties.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-sm border-l-2 border-accent pl-4">
              {lang === 'es' ? '3. Cookies' : '3. Cookies'}
            </h2>
            <p>
              {lang === 'es'
                ? 'Usamos cookies técnicas esenciales para el funcionamiento del sitio y Google Analytics para medir visitas de forma agregada (páginas vistas, origen del tráfico y acciones como descargas o envíos de formularios). Podés bloquear estas cookies desde la configuración de tu navegador.'
                : 'We use essential technical cookies for the site to work and Google Analytics to measure visits in aggregate (page views, traffic sources and actions such as downloads or form submissions). You can block these cookies in your browser settings.'}
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
