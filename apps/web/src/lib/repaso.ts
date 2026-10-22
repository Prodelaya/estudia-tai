import type { ResumenPregunta } from './tipos';

/** Separación mínima entre el primer y el último acierto de una racha para dar una pregunta por retenida. */
export const MARGEN_RETENCION_MS = 20 * 3600 * 1000;

/**
 * Por qué vuelve una pregunta al repaso:
 * - fallada o blanco: la última respuesta no fue un acierto;
 * - confirmar: la acertaste tras fallarla, pero aún no dos veces separadas por al menos un día. Vuelve
 *   cuando ha pasado ese margen desde el último acierto, para comprobar que se mantiene.
 * Una pregunta acertada siempre, o retenida, no vuelve.
 */
export type MotivoRepaso = 'fallada' | 'blanco' | 'confirmar';

export function motivoRepaso(p: ResumenPregunta | undefined, ahora = Date.now()): MotivoRepaso | null {
  if (!p) return null;
  if (!p.ultima) return p.blanco ? 'blanco' : 'fallada';
  if (p.aciertos >= p.vistas) return null;
  const racha = p.racha ?? 1;
  const inicio = p.ts_racha ?? p.ts;
  if (racha >= 2 && p.ts - inicio >= MARGEN_RETENCION_MS) return null;
  return ahora - p.ts >= MARGEN_RETENCION_MS ? 'confirmar' : null;
}
