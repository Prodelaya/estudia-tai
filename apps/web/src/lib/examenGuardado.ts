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

const clave = (usuario: string, examen: string) => `estudia-tai:examen:${usuario}:${examen}`;

export function leerExamen(usuario: string, examen: string, almacen: Almacen | null = almacenNavegador()): ExamenGuardado | null {
  try {
    const g = JSON.parse(almacen?.getItem(clave(usuario, examen)) ?? 'null');
    if (!g || g.v !== 1 || !g.config || typeof g.inicio !== 'number' || typeof g.resp !== 'object') return null;
    return g as ExamenGuardado;
  } catch { return null; }
}

export function guardarExamen(usuario: string, examen: string, g: ExamenGuardado, almacen: Almacen | null = almacenNavegador()) {
  try { almacen?.setItem(clave(usuario, examen), JSON.stringify(g)); } catch { /* sin almacenamiento: no hay autoguardado */ }
}

export function borrarExamen(usuario: string, examen: string, almacen: Almacen | null = almacenNavegador()) {
  try { almacen?.removeItem(clave(usuario, examen)); } catch { /* nada que borrar */ }
}

/** Milisegundos que quedan; Infinity si no hay límite. */
export function restante(g: Pick<ExamenGuardado, 'config' | 'inicio'>, ahora = Date.now()) {
  return g.config.minutos ? g.inicio + g.config.minutos * 60_000 - ahora : Infinity;
}

export function nuevoId() {
  try { return crypto.randomUUID(); } catch { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`; }
}
