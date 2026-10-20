import type { ContenidoTema, Examen, ExamenIndice, PreguntaExamen, PreguntaTema, PreguntaVista, Tema } from './tipos';

const cache = new Map<string, Promise<unknown>>();

function cargar<T>(ruta: string, como: 'json' | 'text' = 'json'): Promise<T | null> {
  if (!cache.has(ruta)) {
    cache.set(ruta, fetch(`/data/${ruta}`, { credentials: 'same-origin' })
      .then(r => (r.ok ? (como === 'json' ? r.json() : r.text()) : null))
      .catch(() => null));
  }
  return cache.get(ruta) as Promise<T | null>;
}

const dos = (n: number) => String(n).padStart(2, '0');

export const datos = {
  temas: () => cargar<Tema[]>('temas.json').then(t => t ?? []),
  leccion: (n: number) => cargar<string>(`lecciones/tema_${dos(n)}.md`, 'text'),
  contenido: (n: number) => cargar<ContenidoTema>(`contenido/tema_${dos(n)}.json`),
  examenes: () => cargar<ExamenIndice[]>('examenes/index.json').then(e => e ?? []),
  examen: (id: string) => cargar<Examen>(`examenes/${id}.json`),
};

const FUENTE: Record<string, string> = { ej1: 'test', ej1_iv: 'test bloque IV', b3: 'supuesto III', b4: 'supuesto IV' };

/** Id con el que se guarda el progreso de una pregunta de tema. */
export const idProgreso = (p: PreguntaTema) => p.ref ?? p.id;

export function desdeTema(p: PreguntaTema, tema: number): PreguntaVista {
  const o = p.origen;
  const etiqueta = p.tipo === 'historica' && o ? `${o.anio === 2025 ? 'Mayo 2026' : 'OEP ' + o.anio} · ${FUENTE[o.parte] ?? o.parte} · ${o.n}` : undefined;
  // Una histórica comparte progreso con su pregunta de examen: se identifica por ref cuando existe.
  return { ...p, id: idProgreso(p), tema, etiqueta };
}

export function desdeExamen(q: PreguntaExamen, ex: Examen, parte: string): PreguntaVista {
  const p = ex.partes[parte];
  const clave = q.clave ?? q.fiab ?? p.fuente_clave ?? ex.fuente_clave;
  return {
    id: q.id, tema: q.tema, q: q.q, op: q.op, ok: q.ok, anulada: q.anulada, obsoleta: q.obsoleta,
    clave: q.dudosa ? 'claude-dudosa' : clave, ctx: parte === 'ej1' ? null : p.contexto || null, subctx: q.ctx2 ?? q.ctx ?? null,
    explicacion: q.nota_clave,
  };
}

/** Explicaciones de las preguntas de examen: las aporta el contenido por tema (campo ref). */
export async function explicacionesPorRef(): Promise<Map<string, string>> {
  const temas = await datos.temas();
  const mapa = new Map<string, string>();
  const todos = await Promise.all(temas.map(t => datos.contenido(t.n)));
  for (const c of todos) for (const p of c?.preguntas ?? []) if (p.ref && p.explicacion) mapa.set(p.ref, p.explicacion);
  return mapa;
}
