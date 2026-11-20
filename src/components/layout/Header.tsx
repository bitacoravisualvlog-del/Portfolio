import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
    navigate(`/${nextLang}${window.location.hash}`);
  };

  // Menú: Servicios · Proyectos · Sobre mí · Recursos (Blog, Podcast) · Contacto (botón)
  const navLinks = [
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.about'), href: '#about' },
  ];
  const resourceLinks = [
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.podcast'), href: '#podcast' },
    { name: t('nav.free_resources', 'Recursos gratis'), href: '#recursos' },
  ];
  const contactLink = { name: t('nav.contact'), href: '#contact' };

  return (
    <header
      className={cn(
        'absolute top-0 left-0 w-full z-50 transition-all duration-300 py-6 px-6 md:px-8 lg:px-12 flex justify-between items-center',
        isScrolled ? 'bg-black/90 py-4 border-b border-gray-mid' : 'bg-transparent'
      )}
    >
      <div className="flex items-center shrink-0">
        <a href="#" className="font-sans text-[10px] md:text-[10px] lg:text-[11px] font-medium text-cream uppercase tracking-[0.1em] hover:text-accent transition-colors whitespace-nowrap">
          Verónica Pereyra Carneiro
        </a>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-8 flex-nowrap">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="font-dm text-[10px] lg:text-xs xl:text-sm uppercase tracking-wide lg:tracking-wider xl:tracking-widest text-cream/70 hover:text-accent transition-colors whitespace-nowrap"
          >
            {link.name}
          </a>
        ))}
        <div className="relative group">
          <a
            href="#blog"
            aria-haspopup="true"
            className="inline-flex items-center gap-1 font-dm text-[10px] lg:text-xs xl:text-sm uppercase tracking-wide lg:tracking-wider xl:tracking-widest text-cream/70 hover:text-accent group-hover:text-accent group-focus-within:text-accent transition-colors whitespace-nowrap"
          >
            {t('nav.resources')} <ChevronDown size={14} />
          </a>
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
            <div className="bg-black border border-gray-mid/60 py-2 min-w-[190px]">
              {resourceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-5 py-2.5 font-dm text-xs uppercase tracking-widest text-cream/75 hover:text-accent hover:bg-gray-dark transition-colors whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <a
          href={contactLink.href}
          className="font-barlow font-bold text-[10px] lg:text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover text-black px-3 lg:px-5 py-2 transition-colors whitespace-nowrap"
        >
          {contactLink.name}
        </a>
        <button
          onClick={toggleLanguage}
          className="font-dm text-[10px] lg:text-xs uppercase tracking-widest bg-gray-dark px-2 lg:px-3 py-1 border border-gray-mid hover:border-accent transition-all"
        >
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4 md:hidden text-cream">
        <button
          onClick={toggleLanguage}
          className="font-dm text-xs uppercase tracking-widest bg-gray-dark px-2 py-1 border border-gray-mid"
        >
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-black z-[60] flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-sans text-[10px] font-medium text-cream uppercase tracking-widest whitespace-nowrap">Verónica Pereyra Carneiro</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-cream">
                <X size={32} />
              </button>
            </div>
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-bebas text-5xl text-cream hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-4">
                <span className="font-bebas text-5xl text-cream">{t('nav.resources')}</span>
                {resourceLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-dm text-lg uppercase tracking-widest text-cream/70 hover:text-accent transition-colors pl-1"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <a
                href={contactLink.href}
                onClick={() => setIsMenuOpen(false)}
                className="self-start font-barlow font-bold text-lg uppercase tracking-widest bg-accent text-black px-8 py-4 mt-2"
              >
                {contactLink.name}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
