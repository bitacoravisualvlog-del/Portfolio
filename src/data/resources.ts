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

// Servicios que se consultan (no se descargan). Se muestran en "Recursos" debajo de los gratuitos.
export interface Service {
  id: string;
  type: string;
  topic: string;
  title: string;
  description: string;
  includes: string[];      // qué incluye, en pocas palabras
  youtubeId: string;       // video explicativo en YouTube
  videoTitle: string;
  inquirySubject: string;  // asunto que se completa en el formulario de contacto
}

export const services: Service[] = [
  {
    id: 'sistema-cm',
    type: 'Servicio',
    topic: 'Community management con IA',
    title: 'Sistema CM de marca',
    description:
      'Tu community manager con IA: un sistema que arma la estrategia, el calendario editable y las piezas listas para publicar de tu marca, para que manejes tus redes con método sin depender de un community manager por mes. Pensado para posicionar tu marca en 2 a 3 meses, generar comunidad y conseguir contactos de clientes reales.',
    includes: [
      'Relevamiento de tu marca: estética, logo, redes, servicios y objetivo',
      'Estrategia con 6 pilares de contenido, días, horarios y embudo de leads',
      'Calendario editable con vista previa del feed y cronómetro',
      'Piezas para Canva y un recurso gratuito para captar leads',
      'Manuales de marca, de redes y de crisis',
    ],
    youtubeId: 'yEYYotlWII0',
    videoTitle: 'Cómo manejar tus redes sin pagar un CM',
    inquirySubject: 'Consulta: Sistema CM de marca',
  },
];
