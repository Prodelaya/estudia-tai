import { almacenNavegador, nuevoId, type Almacen } from './cola';
import type { Letra } from './tipos';

export interface ConfigExamen { partes: string[]; modo: 'examen' | 'practica'; minutos: number; oficial?: boolean }

/** Examen en curso guardado en el navegador para sobrevivir a una recarga o a un cierre accidental. */
export interface ExamenGuardado {
  v: 1;
  config: ConfigExamen;
  resp: Record<string, Letra>;
  i: number;
  /** Hora de inicio: el tiempo sigue corriendo con la pestaña cerrada, como en el examen real. */
  inicio: number;
  cliente_id: string;
  /** Pestaña que lo está haciendo: si se continúa en otra, esta deja de poder responder y entregar. */
  pestana?: string;
}

/** Lo que queda en la clave tras entregar: impide que otra pestaña con el mismo examen lo resucite. */
interface Entregado { v: 1; entregado: true; cliente_id: string }

/** Identifica esta pestaña mientras viva. */
export const PESTANA = nuevoId();

const clave = (usuario: string, examen: string) => `estudia-tai:examen:${usuario}:${examen}`;

function crudo(usuario: string, examen: string, almacen: Almacen | null): ExamenGuardado | Entregado | null {
  try {
    const g = JSON.parse(almacen?.getItem(clave(usuario, examen)) ?? 'null');
    if (!g || g.v !== 1 || typeof g.cliente_id !== 'string') return null;
    if (g.entregado) return g as Entregado;
    if (!g.config || typeof g.inicio !== 'number' || typeof g.resp !== 'object') return null;
    return g as ExamenGuardado;
  } catch { return null; }
}

/** El examen a medias, si lo hay (un examen ya entregado no cuenta). */
export function leerExamen(usuario: string, examen: string, almacen: Almacen | null = almacenNavegador()): ExamenGuardado | null {
  const g = crudo(usuario, examen, almacen);
  return g && !('entregado' in g) ? g : null;
}

/** true si la clave sigue siendo de este examen y de esta pestaña. */
export function esMio(usuario: string, examen: string, cliente_id: string, pestana: string, almacen: Almacen | null = almacenNavegador()) {
  const g = crudo(usuario, examen, almacen);
  return !!g && !('entregado' in g) && g.cliente_id === cliente_id && g.pestana === pestana;
}

/**
 * Guarda el examen en curso. Con varias pestañas solo escribe quien lo está haciendo:
 * - 'nuevo': un examen recién empezado, que puede ocupar una clave vacía o la marca de uno ya entregado.
 * - 'tomar': continuar un examen a medias (aunque lo tuviera otra pestaña, que deja de poder seguir).
 * - 'seguir': los guardados siguientes, solo si la clave sigue siendo de este examen y de esta pestaña.
 * Devuelve 'otra-pestana' si no le toca escribir y 'sin-almacen' si el navegador no deja guardar.
 */
export function guardarExamen(
  usuario: string, examen: string, g: ExamenGuardado, modo: 'nuevo' | 'tomar' | 'seguir', almacen: Almacen | null = almacenNavegador(),
): 'ok' | 'otra-pestana' | 'sin-almacen' {
  if (!almacen) return 'sin-almacen';
  const actual = crudo(usuario, examen, almacen);
  const libre = modo === 'nuevo' ? !actual || 'entregado' in actual
    : modo === 'tomar' ? !!actual && !('entregado' in actual) && actual.cliente_id === g.cliente_id
    : esMio(usuario, examen, g.cliente_id, g.pestana ?? '', almacen);
  if (!libre) return 'otra-pestana';
  try { almacen.setItem(clave(usuario, examen), JSON.stringify(g)); } catch { return 'sin-almacen'; }
  return 'ok';
}

export function marcarEntregado(usuario: string, examen: string, cliente_id: string, almacen: Almacen | null = almacenNavegador()) {
  const actual = crudo(usuario, examen, almacen);
  // Solo se marca si la clave es de este examen (o está vacía): no se borra el examen a medias de otra pestaña.
  if (actual && actual.cliente_id !== cliente_id) return;
  try { almacen?.setItem(clave(usuario, examen), JSON.stringify({ v: 1, entregado: true, cliente_id } satisfies Entregado)); } catch { /* nada */ }
}

/** Descarta el examen a medias, solo si sigue siendo el que se leyó (no otro empezado después en otra pestaña). */
export function borrarExamen(usuario: string, examen: string, cliente_id: string, almacen: Almacen | null = almacenNavegador()) {
  const actual = crudo(usuario, examen, almacen);
  if (!actual || actual.cliente_id !== cliente_id) return;
  try { almacen?.removeItem(clave(usuario, examen)); } catch { /* nada que borrar */ }
}

/** Milisegundos que quedan; Infinity si no hay límite. */
export function restante(g: Pick<ExamenGuardado, 'config' | 'inicio'>, ahora = Date.now()) {
  return g.config.minutos ? g.inicio + g.config.minutos * 60_000 - ahora : Infinity;
}

/** Clave de almacenamiento, para escuchar los cambios que hacen otras pestañas. */
export const claveExamen = clave;

export { nuevoId };
