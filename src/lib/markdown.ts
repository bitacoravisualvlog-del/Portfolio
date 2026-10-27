// Convierte Markdown en texto plano para extractos y meta descripciones.
export function stripMarkdown(md: string = ''): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')              // bloques de código
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')        // imágenes
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')       // links → texto
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')            // títulos
    .replace(/^\s{0,3}>\s?/gm, '')                 // citas
    .replace(/^\s*[-*+]\s+/gm, '')                 // viñetas
    .replace(/^\s*\d+\.\s+/gm, '')                 // listas numeradas
    .replace(/(\*\*|__)(.*?)\1/g, '$2')            // negrita
    .replace(/(\*|_)(.*?)\1/g, '$2')               // cursiva
    .replace(/`([^`]+)`/g, '$1')                   // código en línea
    .replace(/^-{3,}$/gm, '')                      // separadores
    .replace(/\s+/g, ' ')
    .trim();
}

// Recorta en un límite de palabra, agregando "…" si hace falta.
export function excerpt(md: string, max = 155): string {
  const text = stripMarkdown(md);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : max).trimEnd() + '…';
}
