import type { EstadoSrs } from './tipos';

/** Día actual como número entero (días desde 1970), para comparar vencimientos sin horas. */
export const hoy = () => Math.floor(Date.now() / 864e5);

/** Notas de repaso: 0 otra vez, 1 difícil, 2 bien, 3 fácil. */
export type Nota = 0 | 1 | 2 | 3;

/** SM-2 simplificado: un fallo reinicia la tarjeta; la facilidad sube o baja según la nota. */
export function programar(prev: EstadoSrs | undefined, nota: Nota, id: string, tema: number | null, dia = hoy()): EstadoSrs {
  const facilidadPrev = prev?.facilidad ?? 2.5;
  const q = [1, 3, 4, 5][nota];
  const facilidad = Math.max(1.3, Math.round((facilidadPrev + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)) * 100) / 100);
  let repeticiones = prev?.repeticiones ?? 0;
  let intervalo: number;
  if (nota === 0) {
    repeticiones = 0;
    intervalo = 0;
  } else {
    repeticiones += 1;
    if (repeticiones === 1) intervalo = nota === 3 ? 3 : 1;
    else if (repeticiones === 2) intervalo = nota === 1 ? 3 : 6;
    else intervalo = Math.round((prev?.intervalo ?? 1) * facilidad * (nota === 1 ? 0.6 : nota === 3 ? 1.3 : 1));
  }
  return { tarjeta_id: id, tema, facilidad, intervalo, repeticiones, vence: dia + intervalo };
}
