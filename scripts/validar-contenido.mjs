// Comprueba que el contenido de content/ es coherente antes de desplegar: JSON válido, 4 opciones,
// clave en a-d (o null si anulada), ids únicos, refs que existen en los exámenes e imágenes presentes.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = new URL('../content/', import.meta.url).pathname;
const errores = [];
const avisos = [];
const leer = f => JSON.parse(readFileSync(join(RAIZ, f), 'utf8'));
const LETRAS = ['a', 'b', 'c', 'd'];

function revisarPregunta(q, donde) {
  if (!q.q?.trim()) errores.push(`${donde}: enunciado vacío`);
  for (const l of LETRAS) if (typeof q.op?.[l] !== 'string' || !q.op[l].trim()) errores.push(`${donde}: falta la opción ${l}`);
  if (q.ok === null || q.ok === undefined) { if (!q.anulada) errores.push(`${donde}: sin clave y no anulada`); }
  else if (!LETRAS.includes(q.ok)) errores.push(`${donde}: clave «${q.ok}» fuera de a-d`);
  for (const m of `${q.q} ${q.ctx ?? ''} ${q.ctx2 ?? ''}`.matchAll(/\[\[img:([\w.-]+)\]\]/g))
    if (!existsSync(join(RAIZ, 'img', m[1]))) errores.push(`${donde}: falta la imagen ${m[1]}`);
}

const temas = leer('temas.json');
const idsExamen = new Set();
const indice = leer('examenes/index.json');
for (const e of indice) {
  const ex = leer(`examenes/${e.id}.json`);
  for (const [p, parte] of Object.entries(ex.partes)) {
    for (const m of (parte.contexto ?? '').matchAll(/\[\[img:([\w.-]+)\]\]/g))
      if (!existsSync(join(RAIZ, 'img', m[1]))) errores.push(`${e.id}/${p}: falta la imagen ${m[1]}`);
    for (const q of parte.preguntas) {
      if (idsExamen.has(q.id)) errores.push(`id de examen repetido: ${q.id}`);
      idsExamen.add(q.id);
      revisarPregunta(q, q.id);
    }
  }
}

let totales = { preguntas: 0, tarjetas: 0 };
for (const t of temas) {
  const f = `contenido/tema_${String(t.n).padStart(2, '0')}.json`;
  if (!existsSync(join(RAIZ, 'lecciones', `tema_${String(t.n).padStart(2, '0')}.md`))) errores.push(`tema ${t.n}: falta la lección`);
  if (!existsSync(join(RAIZ, f))) { avisos.push(`tema ${t.n}: sin contenido todavía`); continue; }
  const c = leer(f);
  const ids = new Set();
  for (const q of c.preguntas) {
    if (ids.has(q.id)) errores.push(`${f}: id repetido ${q.id}`);
    ids.add(q.id);
    revisarPregunta(q, `${f} ${q.id}`);
    if (!['historica', 'variante', 'nueva'].includes(q.tipo)) errores.push(`${f} ${q.id}: tipo «${q.tipo}»`);
    if (q.ref && !idsExamen.has(q.ref)) errores.push(`${f} ${q.id}: ref ${q.ref} no existe en los exámenes`);
    if (!q.explicacion?.trim()) avisos.push(`${f} ${q.id}: sin explicación`);
  }
  for (const k of c.tarjetas) {
    if (ids.has(k.id)) errores.push(`${f}: id repetido ${k.id}`);
    ids.add(k.id);
    if (!k.anverso?.trim() || !k.reverso?.trim()) errores.push(`${f} ${k.id}: tarjeta incompleta`);
  }
  totales.preguntas += c.preguntas.length;
  totales.tarjetas += c.tarjetas.length;
}

for (const a of avisos.slice(0, 30)) console.warn('aviso:', a);
if (avisos.length > 30) console.warn(`… y ${avisos.length - 30} avisos más`);
for (const e of errores) console.error('ERROR:', e);
console.log(`${indice.length} exámenes (${idsExamen.size} preguntas), ${totales.preguntas} preguntas por tema, ${totales.tarjetas} tarjetas.`);
process.exit(errores.length ? 1 : 0);
