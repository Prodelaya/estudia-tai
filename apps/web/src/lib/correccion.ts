import type { Letra, NotaParte, ParteExamen } from './tipos';

/**
 * Corrección según las bases: (aciertos − errores/3) × valor de pregunta, sobre 50 por parte.
 * Las preguntas de reserva sustituyen, en orden, a las anuladas.
 */
export function corregirParte(parte: ParteExamen, resp: Record<string, Letra | undefined>): NotaParte {
  const normales = parte.preguntas.filter(q => !q.reserva);
  const reservas = parte.preguntas.filter(q => q.reserva && !q.anulada);
  const anuladas = normales.filter(q => q.anulada).length;
  const cuentan = [...normales.filter(q => !q.anulada), ...reservas.slice(0, anuladas)];
  let a = 0, e = 0, b = 0;
  for (const q of cuentan) {
    const r = resp[q.id];
    if (!r) b++;
    else if (r === q.ok) a++;
    else e++;
  }
  const valor = 50 / normales.length;
  return { a, e, b, n: cuentan.length, nota: Math.max(0, Math.round((a - e / 3) * valor * 100) / 100) };
}

export const MINIMO = 25;

export function veredicto(notas: Record<string, NotaParte>): string {
  const test = notas.ej1;
  const sup = Object.keys(notas).find(p => p !== 'ej1');
  if (test && test.nota < MINIMO) return 'No llegas a 25 en el test: según las bases, el supuesto no se corregiría.';
  if (test && sup) {
    return notas[sup].nota >= MINIMO
      ? `Apruebas las dos partes con ${fmt(test.nota + notas[sup].nota)} puntos sobre 100.`
      : 'Apruebas el test, pero el supuesto no llega a 25.';
  }
  return Object.values(notas)[0]?.nota >= MINIMO ? 'Superas el mínimo de 25.' : 'No llegas al mínimo de 25.';
}

export const fmt = (n: number) => n.toFixed(2).replace('.', ',');
