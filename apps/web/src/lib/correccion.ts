import type { CriterioParte, Letra, NotaParte, ParteExamen } from './tipos';

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Corrección según las bases: puntuación directa = aciertos − errores/3. Las preguntas de reserva sustituyen,
 * en orden, a las anuladas. La nota sobre 50 es una conversión lineal orientativa: la oficial depende del
 * corte que fija la Comisión en cada convocatoria.
 */
/** Preguntas que puntúan: las normales no anuladas y, en orden, tantas reservas como anuladas haya. */
export function queCuentan(parte: ParteExamen) {
  const normales = parte.preguntas.filter(q => !q.reserva);
  const reservas = parte.preguntas.filter(q => q.reserva && !q.anulada);
  const anuladas = normales.filter(q => q.anulada).length;
  return [...normales.filter(q => !q.anulada), ...reservas.slice(0, anuladas)];
}

export function corregirParte(parte: ParteExamen, resp: Record<string, Letra | undefined>): NotaParte {
  const cuentan = queCuentan(parte);
  let a = 0, e = 0, b = 0;
  for (const q of cuentan) {
    const r = resp[q.id];
    if (!r) b++;
    else if (r === q.ok) a++;
    else e++;
  }
  // Si hay más anuladas que reservas, el máximo baja: los 50 puntos se reparten entre las que puntúan.
  const valor = cuentan.length ? 50 / cuentan.length : 0;
  return { a, e, b, n: cuentan.length, total: cuentan.length, neta: r2(a - e / 3), nota: Math.max(0, r2((a - e / 3) * valor)) };
}

/** Lo que se puede decir de una parte sin inventar el corte. */
export interface Valoracion {
  neta: number;
  total: number;
  /** Porcentaje neto sobre las preguntas que puntúan. */
  pct: number;
  orientativa: number;
  /** Solo con criterio publicado. */
  corte?: { valor: number; margen: number; fuente: string; url?: string; oficial: boolean; transformada?: number };
  /** Referencia hipotética: un corte en el 50 % de la puntuación directa. */
  referencia: number;
  margenReferencia: number;
}

export function valorar(n: NotaParte, criterio?: CriterioParte): Valoracion {
  // Los intentos anteriores no guardaban neta ni total: se reconstruyen.
  const neta = n.neta ?? r2(n.a - n.e / 3);
  const total = n.total ?? n.n;
  const referencia = total / 2;
  const v: Valoracion = { neta, total, pct: total ? Math.round((neta / total) * 100) : 0, orientativa: n.nota, referencia, margenReferencia: r2(neta - referencia) };
  if (criterio) {
    const c = criterio.corte_directa;
    v.corte = { valor: c, margen: r2(neta - c), fuente: criterio.fuente, url: criterio.url, oficial: criterio.oficial };
    // Solo se transforma si la fuente documenta el método y se llega al corte: por debajo no hay nota oficial.
    if (criterio.oficial && criterio.transformacion_lineal && neta >= c && total > c)
      v.corte.transformada = r2(25 + ((neta - c) * 25) / (total - c));
  }
  return v;
}

const signo = (m: number) => (m >= 0 ? `${fmt(m)} por encima` : `${fmt(-m)} por debajo`);

/** Frases del resultado. Nunca afirma «apruebas» sin un corte oficial publicado. */
export function resumen(notas: Record<string, NotaParte>, criterios: Record<string, CriterioParte | undefined>, nombre: (p: string) => string, antiguo = false): string[] {
  const lineas: string[] = [];
  for (const [p, n] of Object.entries(notas)) {
    const v = valorar(n, criterios[p]);
    const base = `${nombre(p)}: neta ${fmt(v.neta)} de ${v.total} (${v.pct} %).`;
    if (v.corte?.oficial) {
      lineas.push(`${base} El corte oficial de esa convocatoria fue ${fmt(v.corte.valor)}: estarías ${signo(v.corte.margen)}${v.corte.transformada !== undefined ? `, con un ${fmt(v.corte.transformada)} sobre 50` : ''}.`);
    } else if (v.corte) {
      lineas.push(`${base} Según ${v.corte.fuente} (no oficial), el corte fue ${fmt(v.corte.valor)}: estarías ${signo(v.corte.margen)}.`);
    } else {
      lineas.push(`${base} Sin corte oficial publicado. Si fuera el 50 % de la directa (${fmt(v.referencia)}), estarías ${signo(v.margenReferencia)}.`);
    }
  }
  const partes = Object.keys(notas);
  if (partes.includes('ej1') && partes.length > 1)
    lineas.push(antiguo
      ? 'Es un examen de formato antiguo: esta corrección aplica las reglas actuales y puede no coincidir con la de su convocatoria.'
      : 'Según las bases, el supuesto solo se corrige si superas el corte del test.');
  return lineas;
}

export const fmt = (n: number) => n.toFixed(2).replace('.', ',');
