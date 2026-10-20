import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abrir } from './db.js';
import { crearApp } from './app.js';
import { hashear } from './auth.js';

async function montar() {
  const app = await crearApp({ db: abrir(':memory:'), passwordHash: await hashear('secreta'), secreto: 'x'.repeat(40), cookieSegura: false });
  const login = await app.inject({ method: 'POST', url: '/api/login', payload: { password: 'secreta' } });
  const cookie = String(login.headers['set-cookie']).split(';')[0];
  return { app, cookie };
}

test('sin sesión todo lo privado responde 401', async () => {
  const { app } = await montar();
  assert.equal((await app.inject({ url: '/api/progreso' })).statusCode, 401);
  assert.equal((await app.inject({ url: '/api/auth/check' })).statusCode, 401);
});

test('contraseña incorrecta no abre sesión', async () => {
  const { app } = await montar();
  const r = await app.inject({ method: 'POST', url: '/api/login', payload: { password: 'otra' } });
  assert.equal(r.statusCode, 401);
});

test('registra respuestas y las resume por pregunta', async () => {
  const { app, cookie } = await montar();
  assert.equal((await app.inject({ url: '/api/auth/check', headers: { cookie } })).statusCode, 204);
  const items = [
    { pregunta_id: 't15-h-001', tema: 15, elegida: 'a', acierto: false },
    { pregunta_id: 't15-h-001', tema: 15, elegida: 'b', acierto: true },
  ];
  assert.equal((await app.inject({ method: 'POST', url: '/api/respuestas', headers: { cookie }, payload: { items } })).statusCode, 200);
  const p = (await app.inject({ url: '/api/progreso', headers: { cookie } })).json();
  assert.deepEqual(
    p.preguntas.map((x: any) => [x.pregunta_id, x.vistas, x.aciertos, x.ultima]),
    [['t15-h-001', 2, 1, 1]],
  );
});

test('rechaza letras fuera de a-d', async () => {
  const { app, cookie } = await montar();
  const r = await app.inject({ method: 'POST', url: '/api/respuestas', headers: { cookie }, payload: { items: [{ pregunta_id: 'x', elegida: 'e', acierto: true }] } });
  assert.equal(r.statusCode, 400);
});

test('guarda SRS, intentos y marcas', async () => {
  const { app, cookie } = await montar();
  await app.inject({ method: 'PUT', url: '/api/srs/t15-c-001', headers: { cookie }, payload: { tema: 15, facilidad: 2.5, intervalo: 1, repeticiones: 1, vence: 20000 } });
  await app.inject({ method: 'PUT', url: '/api/srs/t15-c-001', headers: { cookie }, payload: { tema: 15, facilidad: 2.6, intervalo: 6, repeticiones: 2, vence: 20006 } });
  const it = (await app.inject({ method: 'POST', url: '/api/intentos', headers: { cookie }, payload: { examen_id: 'LI_2025', partes: ['ej1'], notas: { ej1: { nota: 30 } }, respuestas: { q1: 'a' } } })).json();
  await app.inject({ method: 'PUT', url: '/api/marcas/LI2025-ej1-05', headers: { cookie }, payload: { tema: 22, nota: 'la clave parece c' } });
  const p = (await app.inject({ url: '/api/progreso', headers: { cookie } })).json();
  assert.equal(p.srs[0].intervalo, 6);
  assert.equal(p.intentos[0].id, it.id);
  assert.equal(p.marcas[0].nota, 'la clave parece c');
  const det = (await app.inject({ url: `/api/intentos/${it.id}`, headers: { cookie } })).json();
  assert.deepEqual(det.respuestas, { q1: 'a' });
});

test('sirve web y contenido protegido cuando se configuran los directorios', async () => {
  const { mkdtempSync, writeFileSync, mkdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { tmpdir } = await import('node:os');
  const dir = mkdtempSync(join(tmpdir(), 'tai-'));
  mkdirSync(join(dir, 'web')); mkdirSync(join(dir, 'content'));
  writeFileSync(join(dir, 'web', 'index.html'), '<!doctype html><title>SPA</title>');
  writeFileSync(join(dir, 'content', 'temas.json'), '[]');
  const app = await crearApp({ db: abrir(':memory:'), passwordHash: await hashear('s'), secreto: 'x'.repeat(40), cookieSegura: false, dirWeb: join(dir, 'web'), dirContenido: join(dir, 'content') });
  assert.equal((await app.inject({ url: '/tema/15/test' })).body.includes('SPA'), true);
  assert.equal((await app.inject({ url: '/data/temas.json' })).statusCode, 401);
  const login = await app.inject({ method: 'POST', url: '/api/login', payload: { password: 's' } });
  const cookie = String(login.headers['set-cookie']).split(';')[0];
  const r = await app.inject({ url: '/data/temas.json', headers: { cookie } });
  assert.equal(r.statusCode, 200);
  assert.equal(r.body, '[]');
  writeFileSync(join(dir, 'secreto.txt'), 'NO-DEBE-SALIR');
  for (const url of ['/data/../secreto.txt', '/data/..%2fsecreto.txt', '/data/%2e%2e/secreto.txt'])
    assert.equal((await app.inject({ url, headers: { cookie } })).body.includes('NO-DEBE-SALIR'), false, url);
  assert.equal((await app.inject({ url: '/api/nada', headers: { cookie } })).statusCode, 404);
});
