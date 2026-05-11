import { useTranslation } from 'react-i18next';
import { Instagram, Linkedin, Mail, Twitter, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import ContactForm from '../sections/ContactForm';

export default function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://instagram.com/createdigital_marketing' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com/in/veronicapereyracarneiro' },
    { name: 'Behance', icon: <Twitter size={20} />, url: 'https://www.behance.net/veronicacarneiro' },
    { name: 'TikTok', icon: <Video size={20} />, url: 'https://tiktok.com/@create.digital.mkt' }
  ];

  return (
    <footer id="contact" className="py-32 px-6 md:px-12 bg-black border-t border-gray-mid/20">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        {/* Contact CTA */}
        <div className="space-y-8 flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-bebas text-[clamp(4rem,15vw,10rem)] leading-none text-white tracking-tighter"
          >
            {t('contact.headline')}
          </motion.h2>
          <div className="space-y-4">
            <p className="font-dm text-cream/50 text-xs uppercase tracking-[0.4em]">
              {t('contact.subline')}
            </p>
            <a
              href="mailto:marketingpublicitariodigital4@gmail.com"
              className="font-bebas text-2xl md:text-4xl text-cream hover:text-accent transition-all relative group py-2"
            >
              marketingpublicitariodigital4@gmail.com
              <span className="absolute bottom-1 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Social & Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-24 border-t border-gray-mid/10">
          <p className="font-dm text-[10px] uppercase tracking-widest text-cream/20">
            © 2026 CREATE DIGITAL · BUENOS AIRES, AR · <Link to="/es/admin" className="hover:text-accent">ADMIN</Link> · <Link to="/es/privacy" className="hover:text-accent uppercase">{t('footer.privacy')}</Link>
          </p>
          
          <div className="hidden md:block flex-grow h-[1px] bg-cream/10 mx-12" />

          <div className="flex items-center gap-8">
            {socialLinks.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-barlow font-bold text-xs uppercase tracking-widest text-cream/60 hover:text-accent transition-colors interactive"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
