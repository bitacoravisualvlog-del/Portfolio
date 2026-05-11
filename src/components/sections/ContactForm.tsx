import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { contactService } from '../../services/contactService';

export default function ContactForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus('idle');

    try {
      await contactService.sendMessage(name, email, phone, subject, message);
      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">
              {t('contact.form.name')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-gray-mid/30 py-3 font-dm text-cream focus:border-accent outline-none transition-colors"
              placeholder="Tu nombre"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">
              {t('contact.form.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-mid/30 py-3 font-dm text-cream focus:border-accent outline-none transition-colors"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">
              {t('contact.form.phone')}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent border-b border-gray-mid/30 py-3 font-dm text-cream focus:border-accent outline-none transition-colors"
              placeholder="+54 9 11 ..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">
              {t('contact.form.subject')}
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-transparent border-b border-gray-mid/30 py-3 font-dm text-cream focus:border-accent outline-none transition-colors"
              placeholder="Ej: Consulta sobre diseño UX"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-cream/40 font-dm">
            {t('contact.form.message')}
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent border-b border-gray-mid/30 py-3 font-dm text-cream focus:border-accent outline-none transition-colors resize-none"
            placeholder="Contame en qué puedo ayudarte..."
          />
        </div>

        <div className="pt-4 flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-accent text-black py-4 font-barlow font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50 interactive"
          >
            {isSending ? t('contact.form.sending') : t('contact.form.submit')}
          </button>

          {status === 'success' && (
            <p className="text-accent font-dm text-sm tracking-wide">
              {t('contact.form.success')}
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-400 font-dm text-sm tracking-wide">
              {t('contact.form.error')}
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
}
