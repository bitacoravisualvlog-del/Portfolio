// Recursos descargables de la sección "Recursos".
// Para sumar uno nuevo: subí el archivo y su tapa a /public/recursos y agregá un objeto acá.

export interface Resource {
  id: string;
  type: string;          // etiqueta corta: Checklist, Plantilla, Guía…
  title: string;
  description: string;
  file: string;          // ruta del archivo dentro de /public
  cover: string;         // imagen de tapa (proporción A4 vertical)
  format: string;        // PDF, XLSX…
  pages?: number;
  topic: string;         // Meta Ads, SEO, Diseño web…
}

export const resources: Resource[] = [
  {
    id: 'checklist-auditoria-meta-ads',
    type: 'Checklist',
    title: 'Checklist de auditoría de Meta Ads',
    description:
      'Los 20 puntos para saber si tu inversión funciona: medición, estructura, audiencias, creativos y presupuesto. Marcá cada punto y empezá a corregir por donde más impacta.',
    file: '/recursos/checklist-auditoria-meta-ads.pdf',
    cover: '/recursos/checklist-auditoria-meta-ads.webp',
    format: 'PDF',
    pages: 2,
    topic: 'Meta Ads',
  },
];
