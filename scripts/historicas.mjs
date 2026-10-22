// Una pregunta histórica enlazada (campo ref) tiene una sola fuente: la pregunta del examen. Enunciado, opciones,
// clave y anulación se copian del examen al tema; el tema solo aporta lo suyo (explicación, epígrafe, dificultad).
// Excepción deliberada: si el examen la anuló, el tema puede proponer la opción más defendible.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const RAIZ = new URL('../content/', import.meta.url).pathname;
export const leer = f => JSON.parse(readFileSync(join(RAIZ, f), 'utf8'));
const LETRAS = ['a', 'b', 'c', 'd'];

/** Mapa id → pregunta de todos los exámenes del índice. */
export function preguntasDeExamen() {
  const mapa = new Map();
  for (const e of leer('examenes/index.json'))
    for (const parte of Object.values(leer(`examenes/${e.id}.json`).partes))
      for (const q of parte.preguntas) mapa.set(q.id, q);
  return mapa;
}

/** Diferencias entre la copia del tema y la del examen. Vacío si están sincronizadas. */
export function diferencias(t, e) {
  const d = [];
  if (t.q !== e.q) d.push('enunciado');
  for (const l of LETRAS) if (t.op?.[l] !== e.op?.[l]) d.push(`opción ${l}`);
  if (Boolean(t.anulada) !== Boolean(e.anulada)) d.push('anulada');
  if (!e.anulada && t.ok !== e.ok) d.push('clave');
  if (e.anulada && t.ok !== null && t.ok !== e.ok && !t.anulada) d.push('clave');
  return d;
}

/** Copia del examen al tema los campos canónicos. Devuelve true si cambió algo. */
export function sincronizar(t, e) {
  if (!diferencias(t, e).length) return false;
  t.q = e.q;
  t.op = { ...e.op };
  t.anulada = Boolean(e.anulada);
  // Con la pregunta anulada se conserva la opción defendible que propone el tema, si la hay.
  if (!e.anulada || t.ok === null || t.ok === undefined) t.ok = e.ok;
  return true;
}

/** Restos del PDF que nunca deben aparecer en un enunciado u opción. */
export const RESTOS = [
  /\b\d\d\/TAIL-\d \d+-\d+\b/,
  /\bTAI-L\d \d{4} \d+\/\d+\b/,
  /No abra los cuestionarios/i,
  /INSTITUTO NACIONAL DE ADMINISTRACI[OÓ]N P[UÚ]BLICA/,
  /No se permite la reproducci[oó]n total o parcial/i,
];
