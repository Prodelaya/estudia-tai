import { useMemo } from 'react';
import { marked } from 'marked';

// El Markdown sale de nuestro propio contenido (repo), no de terceros: se pinta sin sanear.
export function Markdown({ texto, className = 'prose' }: { texto: string; className?: string }) {
  const html = useMemo(() => {
    const h = marked.parse(texto, { async: false }) as string;
    return h.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, '</table></div>');
  }, [texto]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
