import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    { id: '01', key: 's1' },
    { id: '02', key: 's2' },
    { id: '03', key: 's3' },
    { id: '04', key: 's4' },
    { id: '05', key: 's5' },
    { id: '06', key: 's6' },
    { id: '07', key: 's7' },
    { id: '08', key: 's8' },
  ];

  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-black">
      <h2 className="font-bebas text-5xl md:text-7xl mb-20 text-white tracking-tight">
        Servicios <span className="text-gray-mid">/</span> Services
      </h2>
      
      <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
        {services.map((s, idx) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (idx % 4) * 0.1, duration: 0.6 }}
            className="group relative border-b border-gray-mid/20 pb-8"
          >
            <div className="flex items-start gap-6">
              <span className="font-dm text-xs text-accent mt-2 tracking-widest">{s.id}</span>
              <div className="space-y-2">
                <h3 className="font-barlow text-2xl md:text-3xl text-cream uppercase transition-colors group-hover:text-white">
                  {t(`services.${s.key}.name`)}
                </h3>
                <p className="font-dm text-sm text-cream/50 max-w-md">
                  {t(`services.${s.key}.desc`)}
                </p>
              </div>
            </div>
            {/* Animated underline */}
            <div className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-accent transition-all duration-500 ease-out group-hover:w-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
