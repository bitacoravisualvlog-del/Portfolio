import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
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

  const navLinks = [
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.podcast'), href: '#podcast' },
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-6 px-6 md:px-12 flex justify-between items-center',
        isScrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-gray-mid' : 'bg-transparent'
      )}
    >
      <a href="#" className="font-bebas text-2xl md:text-3xl text-cream tracking-tight hover:text-accent transition-colors">
        CREATE DIGITAL
      </a>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="font-dm text-sm uppercase tracking-widest text-cream/70 hover:text-accent transition-colors"
          >
            {link.name}
          </a>
        ))}
        <button
          onClick={toggleLanguage}
          className="font-dm text-xs uppercase tracking-widest bg-gray-dark px-3 py-1 border border-gray-mid hover:border-accent transition-all"
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
            className="fixed inset-0 bg-black z-[60] flex flex-col p-8"
          >
            <div className="flex justify-end mb-12">
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
