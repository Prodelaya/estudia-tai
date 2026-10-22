import { almacenNavegador, type Almacen } from './cola';
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
}

/** Lo que queda en la clave tras entregar: impide que otra pestaña con el mismo examen lo resucite. */
interface Entregado { v: 1; entregado: true; cliente_id: string }

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

/**
 * Guarda el examen en curso. Con varias pestañas, solo escribe si la clave sigue siendo de este examen: si otra
 * pestaña lo entregó o empezó otro, devuelve 'otra-pestana' y no pisa nada. `primera` indica el primer guardado
 * de un examen nuevo, que puede ocupar una clave vacía o la marca de uno ya entregado.
 */
export function guardarExamen(usuario: string, examen: string, g: ExamenGuardado, primera = false, almacen: Almacen | null = almacenNavegador()): 'ok' | 'otra-pestana' {
  const actual = crudo(usuario, examen, almacen);
  const libre = primera ? !actual || 'entregado' in actual : !!actual && !('entregado' in actual) && actual.cliente_id === g.cliente_id;
  if (!libre) return 'otra-pestana';
  try { almacen?.setItem(clave(usuario, examen), JSON.stringify(g)); } catch { /* sin almacenamiento: no hay autoguardado */ }
  return 'ok';
}

export function marcarEntregado(usuario: string, examen: string, cliente_id: string, almacen: Almacen | null = almacenNavegador()) {
  const actual = crudo(usuario, examen, almacen);
  // Solo se marca si la clave es de este examen (o está vacía): no se borra el examen a medias de otra pestaña.
  if (actual && actual.cliente_id !== cliente_id) return;
  try { almacen?.setItem(clave(usuario, examen), JSON.stringify({ v: 1, entregado: true, cliente_id } satisfies Entregado)); } catch { /* nada */ }
}

export function borrarExamen(usuario: string, examen: string, almacen: Almacen | null = almacenNavegador()) {
  try { almacen?.removeItem(clave(usuario, examen)); } catch { /* nada que borrar */ }
}

/** Milisegundos que quedan; Infinity si no hay límite. */
export function restante(g: Pick<ExamenGuardado, 'config' | 'inicio'>, ahora = Date.now()) {
  return g.config.minutos ? g.inicio + g.config.minutos * 60_000 - ahora : Infinity;
}

export { nuevoId } from './cola';
