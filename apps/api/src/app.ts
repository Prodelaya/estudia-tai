import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import estatico from '@fastify/static';
import { resolve } from 'node:path';
import type { DB } from './db.js';
import { COOKIE, DURACION_MS, cerrarSesion, crearSesion, sesionValida, verificar } from './auth.js';

export interface Opciones {
  db: DB;
  passwordHash: string;
  secreto: string;
  cookieSegura?: boolean;
  logger?: boolean;
  /** Si se indican, la propia API sirve la web compilada y el contenido (sin Caddy delante). */
  dirWeb?: string;
  dirContenido?: string;
}

const LETRA = { type: 'string', enum: ['a', 'b', 'c', 'd'] } as const;
const ID = { type: 'string', minLength: 1, maxLength: 120 } as const;
const TEMA = { type: ['integer', 'null'], minimum: 0, maximum: 99 } as const;

export async function crearApp(o: Opciones) {
  const app = Fastify({ logger: o.logger ?? false, bodyLimit: 1024 * 1024 });
  await app.register(cookie, { secret: o.secreto });
  await app.register(rateLimit, { global: false });
  const { db } = o;

  const token = (req: FastifyRequest) => {
    const c = req.cookies[COOKIE];
    if (!c) return undefined;
    const u = req.unsignCookie(c);
    return u.valid ? (u.value ?? undefined) : undefined;
  };
  const exigeSesion = async (req: FastifyRequest, rep: FastifyReply) => {
    if (!sesionValida(db, token(req))) return rep.code(401).send({ error: 'no autenticado' });
  };

  app.post('/api/login', {
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
    schema: { body: { type: 'object', required: ['password'], properties: { password: { type: 'string', maxLength: 200 } } } },
  }, async (req, rep) => {
    const { password } = req.body as { password: string };
    if (!o.passwordHash || !(await verificar(password, o.passwordHash))) return rep.code(401).send({ error: 'contraseña incorrecta' });
    rep.setCookie(COOKIE, crearSesion(db), {
      path: '/', httpOnly: true, sameSite: 'strict', secure: o.cookieSegura ?? true, signed: true, maxAge: DURACION_MS / 1000,
    });
    return { ok: true };
  });

  app.post('/api/logout', async (req, rep) => {
    cerrarSesion(db, token(req));
    rep.clearCookie(COOKIE, { path: '/' });
    return { ok: true };
  });

  // Caddy lo usa con forward_auth para proteger /data/*.
  app.get('/api/auth/check', async (req, rep) => rep.code(sesionValida(db, token(req)) ? 204 : 401).send());

  app.register(async priv => {
    priv.addHook('onRequest', exigeSesion);

    priv.get('/api/progreso', async () => ({
      preguntas: db.prepare(`
        SELECT pregunta_id, tema, COUNT(*) AS vistas, SUM(acierto) AS aciertos,
               (SELECT r2.acierto FROM respuestas r2 WHERE r2.pregunta_id = r.pregunta_id ORDER BY r2.ts DESC, r2.id DESC LIMIT 1) AS ultima,
               MAX(ts) AS ts
        FROM respuestas r GROUP BY pregunta_id`).all(),
      srs: db.prepare('SELECT tarjeta_id, tema, facilidad, intervalo, repeticiones, vence FROM srs').all(),
      marcas: db.prepare('SELECT pregunta_id, tema, nota, resuelta, ts FROM marcas ORDER BY ts DESC').all(),
      intentos: db.prepare('SELECT id, examen_id, partes, notas, segundos, ts FROM intentos ORDER BY ts DESC').all()
        .map((f: any) => ({ ...f, partes: JSON.parse(f.partes), notas: JSON.parse(f.notas) })),
    }));

    priv.post('/api/respuestas', {
      schema: { body: { type: 'object', required: ['items'], properties: { items: { type: 'array', maxItems: 500, items: {
        type: 'object', required: ['pregunta_id', 'elegida', 'acierto'],
        properties: { pregunta_id: ID, tema: TEMA, elegida: LETRA, acierto: { type: 'boolean' }, origen: { type: 'string', maxLength: 20 } },
      } } } } },
    }, async req => {
      const { items } = req.body as { items: { pregunta_id: string; tema?: number | null; elegida: string; acierto: boolean; origen?: string }[] };
      const ins = db.prepare('INSERT INTO respuestas (pregunta_id, tema, elegida, acierto, origen, ts) VALUES (?, ?, ?, ?, ?, ?)');
      const ahora = Date.now();
      db.transaction(() => items.forEach(i => ins.run(i.pregunta_id, i.tema ?? null, i.elegida, i.acierto ? 1 : 0, i.origen ?? 'test', ahora)))();
      return { ok: true, n: items.length };
    });

    priv.put('/api/srs/:id', {
      schema: {
        params: { type: 'object', properties: { id: ID } },
        body: { type: 'object', required: ['facilidad', 'intervalo', 'repeticiones', 'vence'], properties: {
          tema: TEMA, facilidad: { type: 'number', minimum: 1.3, maximum: 5 }, intervalo: { type: 'integer', minimum: 0, maximum: 3650 },
          repeticiones: { type: 'integer', minimum: 0 }, vence: { type: 'integer', minimum: 0 },
        } },
      },
    }, async req => {
      const { id } = req.params as { id: string };
      const b = req.body as { tema?: number | null; facilidad: number; intervalo: number; repeticiones: number; vence: number };
      db.prepare(`INSERT INTO srs (tarjeta_id, tema, facilidad, intervalo, repeticiones, vence, ts) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(tarjeta_id) DO UPDATE SET tema = excluded.tema, facilidad = excluded.facilidad, intervalo = excluded.intervalo,
        repeticiones = excluded.repeticiones, vence = excluded.vence, ts = excluded.ts`)
        .run(id, b.tema ?? null, b.facilidad, b.intervalo, b.repeticiones, b.vence, Date.now());
      return { ok: true };
    });

    priv.post('/api/intentos', {
      schema: { body: { type: 'object', required: ['examen_id', 'partes', 'notas', 'respuestas'], properties: {
        examen_id: ID, partes: { type: 'array', items: { type: 'string' } }, notas: { type: 'object' },
        respuestas: { type: 'object', additionalProperties: LETRA }, segundos: { type: ['integer', 'null'] },
      } } },
    }, async req => {
      const b = req.body as { examen_id: string; partes: string[]; notas: object; respuestas: object; segundos?: number | null };
      const r = db.prepare('INSERT INTO intentos (examen_id, partes, notas, respuestas, segundos, ts) VALUES (?, ?, ?, ?, ?, ?)')
        .run(b.examen_id, JSON.stringify(b.partes), JSON.stringify(b.notas), JSON.stringify(b.respuestas), b.segundos ?? null, Date.now());
      return { id: Number(r.lastInsertRowid) };
    });

    priv.get('/api/intentos/:id', async (req, rep) => {
      const f = db.prepare('SELECT * FROM intentos WHERE id = ?').get(Number((req.params as { id: string }).id)) as any;
      if (!f) return rep.code(404).send({ error: 'no existe' });
      return { ...f, partes: JSON.parse(f.partes), notas: JSON.parse(f.notas), respuestas: JSON.parse(f.respuestas) };
    });

    priv.put('/api/marcas/:id', {
      schema: { params: { type: 'object', properties: { id: ID } }, body: { type: 'object', properties: {
        tema: TEMA, nota: { type: 'string', maxLength: 2000 }, resuelta: { type: 'boolean' },
      } } },
    }, async req => {
      const { id } = req.params as { id: string };
      const b = req.body as { tema?: number | null; nota?: string; resuelta?: boolean };
      db.prepare(`INSERT INTO marcas (pregunta_id, tema, nota, resuelta, ts) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(pregunta_id) DO UPDATE SET tema = COALESCE(excluded.tema, marcas.tema), nota = excluded.nota, resuelta = excluded.resuelta, ts = excluded.ts`)
        .run(id, b.tema ?? null, b.nota ?? '', b.resuelta ? 1 : 0, Date.now());
      return { ok: true };
    });

    priv.delete('/api/marcas/:id', async req => {
      db.prepare('DELETE FROM marcas WHERE pregunta_id = ?').run((req.params as { id: string }).id);
      return { ok: true };
    });

    // Copia de seguridad completa del progreso.
    priv.get('/api/export', async (_req, rep) => {
      rep.header('content-disposition', `attachment; filename="estudia-tai-${new Date().toISOString().slice(0, 10)}.json"`);
      return {
        respuestas: db.prepare('SELECT * FROM respuestas').all(),
        srs: db.prepare('SELECT * FROM srs').all(),
        intentos: db.prepare('SELECT * FROM intentos').all(),
        marcas: db.prepare('SELECT * FROM marcas').all(),
      };
    });
  });

  if (o.dirContenido) {
    const raiz = resolve(o.dirContenido);
    app.register(async datos => {
      datos.addHook('onRequest', exigeSesion);
      datos.addHook('onSend', async (_req, rep) => { rep.header('cache-control', 'private, no-cache'); });
      await datos.register(estatico, { root: raiz, prefix: '/data/', decorateReply: false, index: false });
    });
  }

  if (o.dirWeb) {
    const raiz = resolve(o.dirWeb);
    await app.register(estatico, { root: raiz, prefix: '/', wildcard: false, index: false });
    // SPA: cualquier ruta GET que no sea de la API, de datos ni un fichero existente devuelve index.html.
    app.setNotFoundHandler((req, rep) => {
      if (req.method !== 'GET' || req.url.startsWith('/api/') || req.url.startsWith('/data/')) return rep.code(404).send({ error: 'no existe' });
      return rep.sendFile('index.html', raiz);
    });
  }

  return app;
}
