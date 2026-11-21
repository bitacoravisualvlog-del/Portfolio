import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';

// Número que cuenta desde 0 cada vez que entra en pantalla. Respeta prefijos como "+".
export default function CountUp({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? Number(match[2]) : 0;
  const suffix = match?.[3] ?? '';
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!match) return;
    if (!inView) { setN(0); return; }
    const controls = animate(0, target, { duration, ease: 'easeOut', onUpdate: v => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView]);

  if (!match) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}
