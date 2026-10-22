// Una pregunta histórica enlazada (campo ref) tiene una sola fuente: la pregunta del examen. Enunciado, opciones,
// clave, procedencia de la clave y anulación se copian del examen al tema; el tema solo aporta lo suyo
// (explicación, epígrafe, dificultad). Excepción deliberada: si el examen la anuló, el tema puede proponer la
// opción más defendible, y entonces la clave es de Claude.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const RAIZ = new URL('../content/', import.meta.url).pathname;
export const leer = f => JSON.parse(readFileSync(join(RAIZ, f), 'utf8'));
const LETRAS = ['a', 'b', 'c', 'd'];

/**
 * Mapa id → pregunta de todos los exámenes del índice, con `clave_vista`: la procedencia de la clave tal como la
 * muestra la web (la misma regla que desdeExamen en apps/web/src/lib/datos.ts).
 */
export function preguntasDeExamen() {
  const mapa = new Map();
  for (const e of leer('examenes/index.json')) {
    const ex = leer(`examenes/${e.id}.json`);
    for (const parte of Object.values(ex.partes))
      for (const q of parte.preguntas)
        mapa.set(q.id, { ...q, clave_vista: q.dudosa ? 'claude-dudosa' : q.clave ?? q.fiab ?? parte.fuente_clave ?? ex.fuente_clave });
  }
  return mapa;
}

/** Procedencia que debe mostrar la copia del tema: la del examen, o Claude si propone otra opción para una anulada. */
const claveEsperada = (t, e) => (e.anulada && t.ok != null && t.ok !== e.ok ? 'claude' : e.clave_vista);

/** Diferencias entre la copia del tema y la del examen. Vacío si están sincronizadas. */
export function diferencias(t, e) {
  const d = [];
  if (t.q !== e.q) d.push('enunciado');
  for (const l of LETRAS) if (t.op?.[l] !== e.op?.[l]) d.push(`opción ${l}`);
  if (Boolean(t.anulada) !== Boolean(e.anulada)) d.push('anulada');
  if (!e.anulada && t.ok !== e.ok) d.push('clave');
  if (e.anulada && t.ok !== null && t.ok !== e.ok && !t.anulada) d.push('clave');
  if (e.clave_vista !== undefined && t.clave !== claveEsperada(t, e)) d.push('procedencia de la clave');
  return d;
}

/** Copia del examen al tema los campos canónicos. Devuelve true si cambió algo. */
export function sincronizar(t, e) {
  if (!diferencias(t, e).length) return false;
  // Solo se conserva la opción defendible que el tema ya proponía para una anulada. Si el examen la anula ahora,
  // la clave antigua del tema no es una propuesta revisada: se copia la del examen.
  const conservar = Boolean(e.anulada && t.anulada) && t.ok != null;
  t.q = e.q;
  t.op = { ...e.op };
  t.anulada = Boolean(e.anulada);
  if (!conservar) t.ok = e.ok;
  if (e.clave_vista !== undefined) t.clave = claveEsperada(t, e);
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
