import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import Database from 'better-sqlite3';
import { abrir } from './db.js';
import { crearApp } from './app.js';
import { hashear } from './auth.js';

async function montar(db = abrir(':memory:')) {
  const app = await crearApp({ db, passwordHash: await hashear('secreta'), secreto: 'x'.repeat(40), cookieSegura: false });
  const login = await app.inject({ method: 'POST', url: '/api/login', payload: { password: 'secreta' } });
  const cookie = String(login.headers['set-cookie']).split(';')[0];
  return { app, cookie, db };
}

test('guarda blancos, modo y primera exposición, y resume la retención', async () => {
  const { app, cookie, db } = await montar();
  const enviar = (items: object[]) => app.inject({ method: 'POST', url: '/api/respuestas', headers: { cookie }, payload: { items } });
  assert.equal((await enviar([
    { pregunta_id: 'LI2025-ej1-03', tema: 4, elegida: null, acierto: false, origen: 'examen', modo: 'simulacro', ts: 1000 },
    { pregunta_id: 'LI2025-ej1-03', tema: 4, elegida: 'b', acierto: true, origen: 'repaso', modo: 'practica', ts: 2000 },
    { pregunta_id: 'LI2025-ej1-03', tema: 4, elegida: 'b', acierto: true, origen: 'repaso', modo: 'practica', ts: 3000 },
  ])).statusCode, 200);
  const filas = db.prepare('SELECT elegida, blanco, modo, primera FROM respuestas ORDER BY id').all();
  assert.deepEqual(filas, [
    { elegida: '', blanco: 1, modo: 'simulacro', primera: 1 },
    { elegida: 'b', blanco: 0, modo: 'practica', primera: 0 },
    { elegida: 'b', blanco: 0, modo: 'practica', primera: 0 },
  ]);
  const p = (await app.inject({ url: '/api/progreso', headers: { cookie } })).json();
  const r = p.preguntas[0];
  assert.deepEqual([r.vistas, r.aciertos, r.ultima, r.blanco, r.racha, r.ts_racha, r.primera, r.ts], [3, 2, 1, 0, 2, 2000, 0, 3000]);
  // Un fallo nuevo corta la racha; una pregunta nunca fallada tiene racha = vistas.
  await enviar([
    { pregunta_id: 'LI2025-ej1-03', tema: 4, elegida: 'c', acierto: false, modo: 'practica', ts: 4000 },
    { pregunta_id: 'otra', tema: 4, elegida: 'a', acierto: true, ts: 10 },
  ]);
  const q = (await app.inject({ url: '/api/progreso', headers: { cookie } })).json().preguntas;
  const porId = Object.fromEntries(q.map((x: any) => [x.pregunta_id, x]));
  assert.deepEqual([porId['LI2025-ej1-03'].racha, porId['LI2025-ej1-03'].ts_racha, porId['LI2025-ej1-03'].ultima], [0, null, 0]);
  assert.deepEqual([porId.otra.racha, porId.otra.ts_racha, porId.otra.primera], [1, 10, 1]);
});

test('un blanco no puede marcarse como acierto y las horas futuras se recortan', async () => {
  const { app, cookie, db } = await montar();
  const mal = await app.inject({ method: 'POST', url: '/api/respuestas', headers: { cookie }, payload: { items: [{ pregunta_id: 'x', elegida: null, acierto: true }] } });
  assert.equal(mal.statusCode, 400);
  await app.inject({ method: 'POST', url: '/api/respuestas', headers: { cookie }, payload: { items: [{ pregunta_id: 'x', elegida: 'a', acierto: true, ts: Date.now() + 1e9 }] } });
  const { ts } = db.prepare('SELECT ts FROM respuestas').get() as { ts: number };
  assert.ok(ts <= Date.now());
});

test('el intento guarda modo y límite, y el reintento con el mismo cliente_id no duplica', async () => {
  const { app, cookie } = await montar();
  const cuerpo = { examen_id: 'LI_2025', partes: ['ej1', 'b3'], notas: {}, respuestas: {}, segundos: 60, modo: 'simulacro', limite: 120, cliente_id: 'abcdef123456' };
  const a = (await app.inject({ method: 'POST', url: '/api/intentos', headers: { cookie }, payload: cuerpo })).json();
  const b = (await app.inject({ method: 'POST', url: '/api/intentos', headers: { cookie }, payload: cuerpo })).json();
  assert.equal(a.id, b.id);
  const p = (await app.inject({ url: '/api/progreso', headers: { cookie } })).json();
  assert.equal(p.intentos.length, 1);
  assert.deepEqual([p.intentos[0].modo, p.intentos[0].limite], ['simulacro', 120]);
  const mal = await app.inject({ method: 'POST', url: '/api/intentos', headers: { cookie }, payload: { ...cuerpo, modo: 'otro' } });
  assert.equal(mal.statusCode, 400);
});

test('la migración 3 clasifica las respuestas antiguas sin perder nada', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'tai-v2-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const ruta = join(dir, 'v2.db');
  // Base en versión 2 con datos: se crea con las dos primeras migraciones y se rebaja user_version.
  const previa = abrir(ruta);
  previa.exec(`
    DROP INDEX respuestas_cliente; ALTER TABLE respuestas DROP COLUMN cliente_id;
    ALTER TABLE respuestas DROP COLUMN primera; ALTER TABLE respuestas DROP COLUMN modo; ALTER TABLE respuestas DROP COLUMN blanco;
    DROP INDEX intentos_cliente; ALTER TABLE intentos DROP COLUMN cliente_id; ALTER TABLE intentos DROP COLUMN limite; ALTER TABLE intentos DROP COLUMN modo;
    PRAGMA user_version = 2;
    INSERT INTO respuestas (id, pregunta_id, tema, elegida, acierto, origen, ts, usuario_id) VALUES
      (1, 'p1', 15, 'a', 0, 'test', 10, 1), (2, 'p1', 15, 'b', 1, 'repaso', 20, 1), (3, 'p2', 4, 'c', 1, 'examen', 30, 1), (4, 'p1', 15, 'a', 1, 'test', 5, 2);
    INSERT INTO intentos (id, examen_id, partes, notas, respuestas, segundos, ts, usuario_id) VALUES (9, 'LI_2024', '["ej1"]', '{}', '{}', 5, 1, 1);
  `);
  previa.close();
  const comprobacion = new Database(ruta);
  assert.equal(comprobacion.pragma('user_version', { simple: true }), 2);
  comprobacion.close();

  const db = abrir(ruta);
  assert.equal(db.pragma('user_version', { simple: true }), 3);
  assert.deepEqual(db.prepare('SELECT id, blanco, modo, primera FROM respuestas ORDER BY id').all(), [
    { id: 1, blanco: 0, modo: 'practica', primera: 1 },
    { id: 2, blanco: 0, modo: 'practica', primera: 0 },
    { id: 3, blanco: 0, modo: null, primera: 1 },
    { id: 4, blanco: 0, modo: 'practica', primera: 1 },
  ]);
  assert.deepEqual(db.prepare('SELECT id, modo, limite, cliente_id FROM intentos').all(), [{ id: 9, modo: null, limite: null, cliente_id: null }]);
  const { app, cookie } = await montar(db);
  const p = (await app.inject({ url: '/api/progreso', headers: { cookie } })).json();
  assert.equal(p.preguntas.length, 2);
  assert.equal(p.intentos[0].modo, null);
});

test('reintentar un lote con los mismos cliente_id no duplica respuestas', async () => {
  const { app, cookie, db } = await montar();
  const items = [
    { pregunta_id: 'p1', elegida: 'a', acierto: true, ts: 10, cliente_id: 'lote-1:p1' },
    { pregunta_id: 'p2', elegida: null, acierto: false, ts: 10, cliente_id: 'lote-1:p2' },
  ];
  const a = (await app.inject({ method: 'POST', url: '/api/respuestas', headers: { cookie }, payload: { items } })).json();
  const b = (await app.inject({ method: 'POST', url: '/api/respuestas', headers: { cookie }, payload: { items } })).json();
  assert.deepEqual([a.n, b.n], [2, 0]);
  assert.equal((db.prepare('SELECT COUNT(*) AS n FROM respuestas').get() as { n: number }).n, 2);
});

test('la primera exposición se decide por la hora aunque las respuestas lleguen desordenadas', async () => {
  const { app, cookie } = await montar();
  const enviar = (items: object[]) => app.inject({ method: 'POST', url: '/api/respuestas', headers: { cookie }, payload: { items } });
  await enviar([{ pregunta_id: 'm', elegida: 'a', acierto: true, ts: 5000 }]);
  await enviar([{ pregunta_id: 'm', elegida: 'b', acierto: false, ts: 1000 }]);
  const p = (await app.inject({ url: '/api/progreso', headers: { cookie } })).json().preguntas[0];
  assert.deepEqual([p.primera, p.ultima], [0, 1]);
});

test('una escritura de otra cuenta (cabecera distinta de la sesión) se rechaza como sesión perdida', async () => {
  const { app, cookie, db } = await montar();
  const r = await app.inject({
    method: 'POST', url: '/api/respuestas', headers: { cookie, 'x-estudia-usuario': 'nosa' },
    payload: { items: [{ pregunta_id: 'x', elegida: 'a', acierto: true }] },
  });
  assert.equal(r.statusCode, 401);
  assert.equal((db.prepare('SELECT COUNT(*) AS n FROM respuestas').get() as { n: number }).n, 0);
  const ok = await app.inject({
    method: 'POST', url: '/api/respuestas', headers: { cookie, 'x-estudia-usuario': 'laya92' },
    payload: { items: [{ pregunta_id: 'x', elegida: 'a', acierto: true }] },
  });
  assert.equal(ok.statusCode, 200);
});

test('un límite con decimales se redondea y la hora del intento es la del examen', async () => {
  const { app, cookie } = await montar();
  const r = await app.inject({ method: 'POST', url: '/api/intentos', headers: { cookie }, payload: { examen_id: 'LI_2025', partes: ['ej1'], notas: {}, respuestas: {}, limite: 1.5, ts: 1234 } });
  assert.equal(r.statusCode, 200);
  const p = (await app.inject({ url: '/api/progreso', headers: { cookie } })).json();
  assert.deepEqual([p.intentos[0].limite, p.intentos[0].ts], [2, 1234]);
});
