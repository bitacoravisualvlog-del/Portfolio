import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function ValueProp() {
  const { t } = useTranslation();

  const props = [
    { id: '01', title: t('value.one.title'), desc: t('value.one.desc') },
    { id: '02', title: t('value.two.title'), desc: t('value.two.desc') },
    { id: '03', title: t('value.three.title'), desc: t('value.three.desc') },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-black border-y border-gray-mid/10">
      <div className="grid md:grid-cols-3 gap-16 md:gap-0">
        {props.map((prop, idx) => (
          <motion.div
            key={prop.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2, duration: 0.8 }}
            className={cn(
              "flex flex-col gap-6 md:px-8",
              idx !== 0 && "md:border-l md:border-cream/10"
            )}
          >
            <span className="font-bebas text-7xl md:text-8xl text-accent leading-none">
              {prop.id}
            </span>
            <div className="space-y-4">
              <h3 className="font-barlow text-2xl md:text-3xl text-cream uppercase tracking-tight leading-tight">
                {prop.title}
              </h3>
              <p className="font-dm text-sm text-cream/70 leading-relaxed max-w-sm">
                {prop.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
