// Servicios que se pueden elegir en el cotizador ("Pedí tu presupuesto").
// Sin precios: el presupuesto se arma a mano después de recibir el pedido.
// Para sumar o quitar un servicio, editá esta lista.

export interface QuoteOption {
  id: string;
  name: string;
  detail: string;
}

export interface QuoteGroup {
  id: string;
  title: string;
  options: QuoteOption[];
}

export const QUOTE_GROUPS: QuoteGroup[] = [
  {
    id: 'paquetes',
    title: 'Paquetes mensuales',
    options: [
      { id: 'pack-basico', name: 'Paquete Básico · Presencia ordenada', detail: '1 red, estrategia y calendario, posts, reels, stories e informe mensual.' },
      { id: 'pack-medium', name: 'Paquete Medium · Crecimiento', detail: '2 redes, contenido con IA o UGC, gestión de Meta Ads y medición.' },
      { id: 'pack-premium', name: 'Paquete Premium · Marca autónoma', detail: '3 redes y 1 canal profesional, Meta y Google Ads, medición completa y Sistema CM de marca.' },
    ],
  },
  {
    id: 'redes',
    title: 'Estrategia y redes',
    options: [
      { id: 'estrategia', name: 'Estrategia de contenido', detail: 'Pilares, tono, formatos y calendario de 30 días.' },
      { id: 'cm-1', name: 'Community management · 1 red', detail: 'Posts, reels, stories e informe mensual.' },
      { id: 'cm-2', name: 'Community management · 2 redes', detail: 'Con calendario unificado.' },
      { id: 'cm-3', name: 'Community management · 3 redes', detail: 'Calendario y diseño coordinados.' },
      { id: 'cm-4', name: 'Community management · 4 redes', detail: 'Estrategia común y respuesta a comentarios y mensajes.' },
    ],
  },
  {
    id: 'plataformas',
    title: 'Contenido por plataforma',
    options: [
      { id: 'youtube', name: 'YouTube', detail: 'Guion, edición, miniaturas y títulos con SEO.' },
      { id: 'podcast', name: 'Podcast', detail: 'Edición del episodio, portada, clips verticales y publicación.' },
      { id: 'linkedin', name: 'LinkedIn · posicionamiento profesional', detail: 'Publicaciones con storytelling y optimización del perfil.' },
      { id: 'tiktok', name: 'TikTok', detail: 'Videos con guion, edición y subtítulos.' },
      { id: 'pinterest', name: 'Pinterest', detail: 'Pines y tableros optimizados con enlaces a tu web.' },
    ],
  },
  {
    id: 'video',
    title: 'Producción con IA y video',
    options: [
      { id: 'spec-ad', name: 'Spec Ad con IA', detail: 'Publicidad de 30 a 45 segundos hecha con IA, con guion y edición.' },
      { id: 'ugc', name: 'Contenido UGC', detail: 'Videos con estilo de usuario real, ideales como anuncios.' },
      { id: 'egc', name: 'Contenido EGC', detail: 'Videos protagonizados por tu equipo.' },
      { id: 'edicion-vertical', name: 'Edición de video vertical 9:16', detail: 'Reels y shorts con el material que nos pasás.' },
      { id: 'edicion-largo', name: 'Edición de video largo', detail: 'Videos de YouTube o podcast de hasta 20 minutos.' },
      { id: 'videoclip', name: 'Videoclip', detail: 'Preproducción, maqueta con IA, rodaje y edición.' },
    ],
  },
  {
    id: 'pauta',
    title: 'Publicidad y auditorías',
    options: [
      { id: 'meta-ads', name: 'Gestión de Meta Ads', detail: 'Campañas en Instagram y Facebook con informe semanal.' },
      { id: 'google-ads', name: 'Gestión de Google Ads', detail: 'Búsqueda, Shopping y Performance Max.' },
      { id: 'meta-google', name: 'Meta Ads + Google Ads', detail: 'Las dos plataformas con una sola estrategia.' },
      { id: 'auditoria', name: 'Auditoría de web, redes o anuncios', detail: 'Diagnóstico con datos y plan priorizado.' },
      { id: 'auditoria-completa', name: 'Auditoría completa', detail: 'Web, redes y anuncios con plan de acción a 90 días.' },
    ],
  },
  {
    id: 'medicion',
    title: 'Configuración y medición',
    options: [
      { id: 'portfolio-comercial', name: 'Cuenta publicitaria y portfolio comercial', detail: 'Tus activos ordenados y a tu nombre.' },
      { id: 'pixel-capi', name: 'Píxel y API de conversiones', detail: 'Eventos de compra y contacto bien medidos.' },
      { id: 'ga4-ads', name: 'Tienda conectada a Google Analytics y Google Ads', detail: 'Saber de dónde viene cada venta.' },
      { id: 'indexacion', name: 'Indexación de webs', detail: 'Search Console, sitemap y robots.' },
      { id: 'pack-medicion', name: 'Pack de medición completa', detail: 'Todo lo anterior, listo para pautar.' },
    ],
  },
  {
    id: 'web',
    title: 'Diseño web y tiendas',
    options: [
      { id: 'landing', name: 'Landing page', detail: 'Una página enfocada en una sola acción.' },
      { id: 'web-wordpress', name: 'Web institucional en WordPress', detail: 'Hasta 5 secciones, optimizada para Google.' },
      { id: 'tiendanube', name: 'Tienda en Tienda Nube', detail: 'Diseño, productos, pagos y envíos.' },
      { id: 'empretienda', name: 'Tienda en Empretienda', detail: 'Una opción simple para lanzar rápido.' },
      { id: 'woocommerce', name: 'Tienda en WordPress (WooCommerce)', detail: 'Tienda a medida con más control.' },
      { id: 'apps-ia', name: 'Apps y herramientas con IA', detail: 'Paneles, cotizadores y herramientas a medida.' },
      { id: 'mantenimiento', name: 'Mantenimiento web', detail: 'Actualizaciones, copias de seguridad y cambios.' },
      { id: 'ux-ui', name: 'Diseño UX/UI de apps o webs', detail: 'Investigación, flujos y prototipos.' },
    ],
  },
  {
    id: 'otros',
    title: 'Sistema CM, capacitación y otros',
    options: [
      { id: 'sistema-cm', name: 'Sistema CM de marca', detail: 'Tu community manager con IA, con instalación y capacitación.' },
      { id: 'capacitacion', name: 'Capacitación (UX/UI o contenido)', detail: 'Clases para equipos o emprendedores.' },
      { id: 'artistas', name: 'Artistas musicales', detail: 'Distribución y promoción de tu lanzamiento.' },
      { id: 'agencias', name: 'Servicios para agencias', detail: 'Freelance o marca blanca: podcasts, SEO y edición.' },
      { id: 'storytelling-seo', name: 'Copywriting y artículos SEO', detail: 'Textos de venta, blog, LinkedIn y newsletter.' },
    ],
  },
];

export const GOALS = [
  'Vender más',
  'Conseguir más consultas',
  'Hacer conocida mi marca',
  'Lanzar un producto o servicio',
  'Ordenar mis redes',
  'Tener mi web o tienda',
  'Otro',
];

export const TIMELINES = ['Lo antes posible', 'En el próximo mes', 'En 2 o 3 meses', 'Todavía lo estoy evaluando'];

export const BUDGETS = [
  'Prefiero no decirlo',
  'Hasta $200.000 por mes',
  '$200.000 a $500.000 por mes',
  '$500.000 a $1.000.000 por mes',
  'Más de $1.000.000 por mes',
  'Es un proyecto puntual',
];
