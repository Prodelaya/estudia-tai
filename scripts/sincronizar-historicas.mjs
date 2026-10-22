// Copia enunciado, opciones, clave y anulación de cada pregunta de examen a sus históricas enlazadas en los temas.
// Uso: node scripts/sincronizar-historicas.mjs   (después, npm run check)
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, leer, preguntasDeExamen, sincronizar } from './historicas.mjs';

const examen = preguntasDeExamen();
let cambios = 0;
for (const f of readdirSync(join(RAIZ, 'contenido')).filter(f => f.endsWith('.json')).sort()) {
  const c = leer(`contenido/${f}`);
  let tocado = false;
  for (const t of c.preguntas) {
    const e = t.ref && examen.get(t.ref);
    if (e && sincronizar(t, e)) { console.log(`${f} ${t.id} ← ${t.ref}`); tocado = true; cambios++; }
  }
  if (tocado) writeFileSync(join(RAIZ, 'contenido', f), JSON.stringify(c, null, 1));
}
console.log(`${cambios} preguntas sincronizadas.`);
