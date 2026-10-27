/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Clients from './components/sections/Clients';
import ValueProp from './components/sections/ValueProp';
import Services from './components/sections/Services';
import Projects from './components/sections/Projects';
import UGC from './components/sections/UGC';
import About from './components/sections/About';
import Podcast from './components/sections/Podcast';
import Privacy from './components/sections/Privacy';
import Blog from './components/sections/Blog';
import Recommendations from './components/sections/Recommendations';
import BlogPost from './components/sections/BlogPost';
import Admin from './components/sections/Admin';
import { useSeo } from './lib/seo';

const HOME_SEO = {
  es: {
    title: 'CREATE DIGITAL | Diseño web, Meta Ads y estrategia digital',
    description: 'Estudio creativo de Verónica Pereyra Carneiro en Buenos Aires: diseño web en WordPress y Tienda Nube, campañas de Meta Ads, UX/UI y contenido que convierte.',
  },
  en: {
    title: 'CREATE DIGITAL | Web design, Meta Ads & digital strategy',
    description: 'Creative studio by Verónica Pereyra Carneiro in Buenos Aires: WordPress and Tienda Nube web design, Meta Ads campaigns, UX/UI and content that converts.',
  },
} as const;

function Root() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const seoLang = lang === 'en' ? 'en' : 'es';

  useEffect(() => {
    if (lang && (lang === 'es' || lang === 'en')) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useSeo({ ...HOME_SEO[seoLang], path: `/${seoLang}`, lang: seoLang });

  return (
    <div className="relative min-h-screen selection:bg-accent selection:text-white bg-black">
      {/* Decorative Textures */}
      <div className="grain-overlay" />
      
      <Header />
      
      <main>
        <Hero />
        <Clients />
        <ValueProp />
        <Services />
        <Projects />
        <UGC />
        <About />
        <Podcast />
        <Blog />
        <Recommendations />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:lang" element={<Root />} />
        <Route path="/:lang/blog/:slug" element={<BlogPost />} />
        <Route path="/:lang/privacy" element={<Privacy />} />
        <Route path="/:lang/admin" element={<Admin />} />
        <Route path="/" element={<Navigate to="/es" replace />} />
        {/* Fallback for invalid locales */}
        <Route path="*" element={<Navigate to="/es" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
