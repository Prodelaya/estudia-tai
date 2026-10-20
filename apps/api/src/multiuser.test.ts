import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { abrir } from './db.js';
import { crearApp } from './app.js';
import { hashear, sesionValida } from './auth.js';

const OWNER_PASSWORD = 'owner-disposable-fixture';
const NEW_PASSWORD = 'invitee-disposable-fixture';
type App = Awaited<ReturnType<typeof crearApp>>;
const cookie = (r: { headers: Record<string, unknown> }) => String(r.headers['set-cookie']).split(';')[0];

async function montar(t: TestContext, db = abrir(':memory:')) {
  const app = await crearApp({ db, passwordHash: await hashear(OWNER_PASSWORD), secreto: 'test-only-'.repeat(5), cookieSegura: false });
  t.after(async () => { await app.close(); db.close(); });
  const login = await app.inject({ method: 'POST', url: '/api/login', payload: { usuario: 'laya92', password: OWNER_PASSWORD } });
  assert.equal(login.statusCode, 200);
  return { app, db, owner: cookie(login) };
}

async function invitar(app: App, owner: string, usuario: string) {
  const r = await app.inject({ method: 'POST', url: `/api/usuarios/${usuario}/invitacion`, headers: { cookie: owner } });
  assert.equal(r.statusCode, 200);
  const body = r.json();
  assert.match(body.token, /^[A-Za-z0-9_-]{43}$/);
  assert.ok(body.expira > Date.now());
  assert.match(String(r.headers['cache-control']), /no-store/);
  return body.token as string;
}

async function activar(app: App, owner: string, usuario: string) {
  const token = await invitar(app, owner, usuario);
  const r = await app.inject({ method: 'POST', url: '/api/activar', payload: { token, password: NEW_PASSWORD } });
  assert.equal(r.statusCode, 200);
  return cookie(r);
}

test('a pending or unknown account cannot use the existing owner password', async t => {
  const { app } = await montar(t);
  for (const usuario of ['nosa', 'jota', 'unknown']) {
    const r = await app.inject({ method: 'POST', url: '/api/login', payload: { usuario, password: OWNER_PASSWORD } });
    assert.equal(r.statusCode, 401, usuario);
    assert.equal(r.headers['set-cookie'], undefined);
  }
});

test('owner identity and private account status; no public signup', async t => {
  const { app, owner } = await montar(t);
  assert.deepEqual((await app.inject({ url: '/api/yo', headers: { cookie: owner } })).json(), { nombre: 'laya92', admin: true });
  const r = await app.inject({ url: '/api/usuarios', headers: { cookie: owner } });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.json(), [
    { nombre: 'laya92', activo: true }, { nombre: 'nosa', activo: false }, { nombre: 'jota', activo: false },
  ]);
  assert.equal((await app.inject({ url: '/api/usuarios' })).statusCode, 401);
  assert.equal((await app.inject({ method: 'POST', url: '/api/usuarios/nosa/invitacion' })).statusCode, 401);
  assert.equal((await app.inject({ method: 'POST', url: '/api/register', payload: {} })).statusCode, 404);
});

test('invitations are hashed, owner-only, single-use and cannot reset an active account', async t => {
  const { app, db, owner } = await montar(t);
  const token = await invitar(app, owner, 'nosa');
  const stored = db.prepare('SELECT token_hash FROM invitaciones').get() as { token_hash: string };
  assert.equal(stored.token_hash, createHash('sha256').update(token).digest('hex'));
  const activated = await app.inject({ method: 'POST', url: '/api/activar', payload: { token, password: NEW_PASSWORD } });
  assert.equal(activated.statusCode, 200);
  const nosa = cookie(activated);
  assert.deepEqual((await app.inject({ url: '/api/yo', headers: { cookie: nosa } })).json(), { nombre: 'nosa', admin: false });
  assert.equal((await app.inject({ method: 'POST', url: '/api/activar', payload: { token, password: 'different-fixture-password' } })).statusCode, 400);
  assert.equal((await app.inject({ method: 'POST', url: '/api/usuarios/nosa/invitacion', headers: { cookie: owner } })).statusCode, 409);
  assert.equal((await app.inject({ method: 'POST', url: '/api/usuarios/jota/invitacion', headers: { cookie: nosa } })).statusCode, 403);
  assert.equal((await app.inject({ url: '/api/usuarios', headers: { cookie: nosa } })).statusCode, 403);
  const login = await app.inject({ method: 'POST', url: '/api/login', payload: { usuario: 'nosa', password: NEW_PASSWORD } });
  assert.equal(login.statusCode, 200);
  assert.equal((await app.inject({ method: 'POST', url: '/api/login', payload: { usuario: 'laya92', password: NEW_PASSWORD } })).statusCode, 401);
});

test('expired, replaced, malformed and short-password invitations fail without activating', async t => {
  const { app, db, owner } = await montar(t);
  const first = await invitar(app, owner, 'jota');
  const token = await invitar(app, owner, 'jota');
  for (const [candidate, password] of [[first, NEW_PASSWORD], ['invalid', NEW_PASSWORD], [token, 'x'.repeat(11)], [token, 'x'.repeat(201)]]) {
    assert.equal((await app.inject({ method: 'POST', url: '/api/activar', payload: { token: candidate, password } })).statusCode, 400);
  }
  db.prepare('UPDATE invitaciones SET expira = ?').run(Date.now() - 1);
  assert.equal((await app.inject({ method: 'POST', url: '/api/activar', payload: { token, password: NEW_PASSWORD } })).statusCode, 400);
  assert.equal((db.prepare("SELECT password_hash FROM usuarios WHERE nombre = 'jota'").get() as { password_hash: string | null }).password_hash, null);
});

test('simultaneous activation consumes one invitation only once', async t => {
  const { app, owner } = await montar(t);
  const token = await invitar(app, owner, 'nosa');
  const results = await Promise.all([NEW_PASSWORD, 'other-disposable-password'].map(password =>
    app.inject({ method: 'POST', url: '/api/activar', payload: { token, password } })));
  assert.deepEqual(results.map(r => r.statusCode).sort(), [200, 400]);
});

test('all progress operations and exports are isolated even with identical object IDs', async t => {
  const { app, owner } = await montar(t);
  const nosa = await activar(app, owner, 'nosa');
  const jota = await activar(app, owner, 'jota');
  const users = [{ cookie: owner, tag: 'owner', intervalo: 10, acierto: false }, { cookie: nosa, tag: 'nosa', intervalo: 20, acierto: true }, { cookie: jota, tag: 'jota', intervalo: 30, acierto: true }];
  const attempts: number[] = [];
  for (const u of users) {
    const headers = { cookie: u.cookie };
    assert.equal((await app.inject({ method: 'POST', url: '/api/respuestas', headers, payload: { usuario_id: 1, items: [{ pregunta_id: 'same', tema: 15, elegida: 'a', acierto: u.acierto }] } })).statusCode, 200);
    assert.equal((await app.inject({ method: 'PUT', url: '/api/srs/same', headers, payload: { usuario_id: 1, tema: 15, facilidad: 2.5, intervalo: u.intervalo, repeticiones: 1, vence: 100 } })).statusCode, 200);
    assert.equal((await app.inject({ method: 'PUT', url: '/api/marcas/same', headers, payload: { usuario_id: 1, tema: 15, nota: u.tag } })).statusCode, 200);
    const r = await app.inject({ method: 'POST', url: '/api/intentos', headers, payload: { usuario_id: 1, examen_id: 'same', partes: ['ej1'], notas: { usuario: u.tag }, respuestas: { same: 'a' } } });
    assert.equal(r.statusCode, 200);
    attempts.push(r.json().id);
  }
  for (const [i, u] of users.entries()) {
    const headers = { cookie: u.cookie };
    const p = (await app.inject({ url: '/api/progreso?usuario_id=1', headers })).json();
    assert.equal(p.preguntas.length, 1);
    assert.equal(p.preguntas[0].ultima, Number(u.acierto));
    assert.equal(p.srs.length, 1);
    assert.equal(p.srs[0].intervalo, u.intervalo);
    assert.equal(p.marcas.length, 1);
    assert.equal(p.marcas[0].nota, u.tag);
    assert.equal(p.intentos.length, 1);
    assert.equal(p.intentos[0].id, attempts[i]);
    const exp = (await app.inject({ url: '/api/export?usuario_id=1', headers })).json();
    for (const key of ['respuestas', 'srs', 'intentos', 'marcas']) assert.equal(exp[key].length, 1, key);
    assert.equal(exp.marcas[0].nota, u.tag);
    for (const [other, id] of attempts.entries()) {
      assert.equal((await app.inject({ url: `/api/intentos/${id}`, headers })).statusCode, other === i ? 200 : 404);
    }
  }
  assert.equal((await app.inject({ method: 'DELETE', url: '/api/marcas/same', headers: { cookie: nosa } })).statusCode, 200);
  assert.equal((await app.inject({ url: '/api/progreso', headers: { cookie: owner } })).json().marcas[0].nota, 'owner');
  assert.equal((await app.inject({ url: '/api/progreso', headers: { cookie: nosa } })).json().marcas.length, 0);
});

test('logout and expiry affect only the authenticated account', async t => {
  const { app, db, owner } = await montar(t);
  const nosa = await activar(app, owner, 'nosa');
  await app.inject({ method: 'POST', url: '/api/logout', headers: { cookie: nosa } });
  assert.equal((await app.inject({ url: '/api/progreso', headers: { cookie: nosa } })).statusCode, 401);
  assert.equal((await app.inject({ url: '/api/progreso', headers: { cookie: owner } })).statusCode, 200);
  const jota = await activar(app, owner, 'jota');
  db.prepare("UPDATE sesiones SET expira = 0 WHERE usuario_id = (SELECT id FROM usuarios WHERE nombre = 'jota')").run();
  assert.equal((await app.inject({ url: '/api/auth/check', headers: { cookie: jota } })).statusCode, 401);
  assert.equal((await app.inject({ url: '/api/yo', headers: { cookie: owner } })).statusCode, 200);
});

test('legacy migration preserves owner password, progress and live sessions; bootstrap is idempotent', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'tai-legacy-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = join(dir, 'legacy.db');
  const old = new Database(path);
  old.exec(`
    CREATE TABLE respuestas(id INTEGER PRIMARY KEY, pregunta_id TEXT NOT NULL, tema INTEGER, elegida TEXT NOT NULL, acierto INTEGER NOT NULL, origen TEXT NOT NULL, ts INTEGER NOT NULL);
    CREATE INDEX respuestas_pregunta ON respuestas(pregunta_id, ts);
    CREATE INDEX respuestas_tema ON respuestas(tema);
    CREATE TABLE srs(tarjeta_id TEXT PRIMARY KEY, tema INTEGER, facilidad REAL NOT NULL, intervalo INTEGER NOT NULL, repeticiones INTEGER NOT NULL, vence INTEGER NOT NULL, ts INTEGER NOT NULL);
    CREATE TABLE intentos(id INTEGER PRIMARY KEY, examen_id TEXT NOT NULL, partes TEXT NOT NULL, notas TEXT NOT NULL, respuestas TEXT NOT NULL, segundos INTEGER, ts INTEGER NOT NULL);
    CREATE TABLE marcas(pregunta_id TEXT PRIMARY KEY, tema INTEGER, nota TEXT NOT NULL DEFAULT '', resuelta INTEGER NOT NULL DEFAULT 0, ts INTEGER NOT NULL);
    CREATE TABLE sesiones(token TEXT PRIMARY KEY, expira INTEGER NOT NULL);
    INSERT INTO respuestas VALUES(7,'legacy',15,'a',1,'test',1);
    INSERT INTO srs VALUES('legacy',15,2.5,9,1,999,1);
    INSERT INTO marcas VALUES('legacy',15,'keep existing progress',0,1);
    INSERT INTO intentos VALUES(42,'legacy','["ej1"]','{}','{"q1":"a"}',10,1);
    PRAGMA user_version=1;
  `);
  old.prepare('INSERT INTO sesiones VALUES(?,?)').run('disposable-legacy-session', Date.now() + 60_000);
  old.close();
  const db = abrir(path);
  const { app, owner } = await montar(t, db);
  assert.equal(sesionValida(db, 'disposable-legacy-session'), true);
  const p = (await app.inject({ url: '/api/progreso', headers: { cookie: owner } })).json();
  assert.equal(p.preguntas[0].pregunta_id, 'legacy');
  assert.equal(p.srs[0].intervalo, 9);
  assert.equal(p.marcas[0].nota, 'keep existing progress');
  assert.equal(p.intentos[0].id, 42);
  const nosa = await activar(app, owner, 'nosa');
  assert.deepEqual((await app.inject({ url: '/api/progreso', headers: { cookie: nosa } })).json(), { preguntas: [], srs: [], marcas: [], intentos: [] });
  const second = await crearApp({ db, passwordHash: await hashear('different-bootstrap-fixture'), secreto: 'test-only-'.repeat(5), cookieSegura: false });
  t.after(() => second.close());
  assert.equal((await second.inject({ method: 'POST', url: '/api/login', payload: { usuario: 'laya92', password: OWNER_PASSWORD } })).statusCode, 200);
  assert.equal((await second.inject({ method: 'POST', url: '/api/login', payload: { usuario: 'nosa', password: NEW_PASSWORD } })).statusCode, 200);
});
