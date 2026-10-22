import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// Las migraciones se aplican en orden y se anotan en user_version.
const MIGRACIONES = [
  `CREATE TABLE respuestas (
     id INTEGER PRIMARY KEY,
     pregunta_id TEXT NOT NULL,
     tema INTEGER,
     elegida TEXT NOT NULL,
     acierto INTEGER NOT NULL,
     origen TEXT NOT NULL DEFAULT 'test',
     ts INTEGER NOT NULL
   );
   CREATE INDEX respuestas_pregunta ON respuestas(pregunta_id, ts);
   CREATE INDEX respuestas_tema ON respuestas(tema);
   CREATE TABLE srs (
     tarjeta_id TEXT PRIMARY KEY,
     tema INTEGER,
     facilidad REAL NOT NULL,
     intervalo INTEGER NOT NULL,
     repeticiones INTEGER NOT NULL,
     vence INTEGER NOT NULL,
     ts INTEGER NOT NULL
   );
   CREATE TABLE intentos (
     id INTEGER PRIMARY KEY,
     examen_id TEXT NOT NULL,
     partes TEXT NOT NULL,
     notas TEXT NOT NULL,
     respuestas TEXT NOT NULL,
     segundos INTEGER,
     ts INTEGER NOT NULL
   );
   CREATE TABLE marcas (
     pregunta_id TEXT PRIMARY KEY,
     tema INTEGER,
     nota TEXT NOT NULL DEFAULT '',
     resuelta INTEGER NOT NULL DEFAULT 0,
     ts INTEGER NOT NULL
   );
   CREATE TABLE sesiones (
     token TEXT PRIMARY KEY,
     expira INTEGER NOT NULL
   );`,
  `CREATE TABLE usuarios (
     id INTEGER PRIMARY KEY,
     nombre TEXT NOT NULL UNIQUE,
     password_hash TEXT
   );
   INSERT INTO usuarios (id, nombre) VALUES (1, 'laya92'), (2, 'nosa'), (3, 'jota');
   ALTER TABLE respuestas ADD COLUMN usuario_id INTEGER NOT NULL DEFAULT 1;
   ALTER TABLE intentos ADD COLUMN usuario_id INTEGER NOT NULL DEFAULT 1;
   ALTER TABLE sesiones ADD COLUMN usuario_id INTEGER NOT NULL DEFAULT 1;
   CREATE INDEX respuestas_usuario ON respuestas(usuario_id, pregunta_id, ts);
   ALTER TABLE srs RENAME TO srs_anterior;
   CREATE TABLE srs (
     usuario_id INTEGER NOT NULL DEFAULT 1 REFERENCES usuarios(id),
     tarjeta_id TEXT NOT NULL,
     tema INTEGER,
     facilidad REAL NOT NULL,
     intervalo INTEGER NOT NULL,
     repeticiones INTEGER NOT NULL,
     vence INTEGER NOT NULL,
     ts INTEGER NOT NULL,
     PRIMARY KEY (usuario_id, tarjeta_id)
   );
   INSERT INTO srs SELECT 1, tarjeta_id, tema, facilidad, intervalo, repeticiones, vence, ts FROM srs_anterior;
   DROP TABLE srs_anterior;
   ALTER TABLE marcas RENAME TO marcas_anterior;
   CREATE TABLE marcas (
     usuario_id INTEGER NOT NULL DEFAULT 1 REFERENCES usuarios(id),
     pregunta_id TEXT NOT NULL,
     tema INTEGER,
     nota TEXT NOT NULL DEFAULT '',
     resuelta INTEGER NOT NULL DEFAULT 0,
     ts INTEGER NOT NULL,
     PRIMARY KEY (usuario_id, pregunta_id)
   );
   INSERT INTO marcas SELECT 1, pregunta_id, tema, nota, resuelta, ts FROM marcas_anterior;
   DROP TABLE marcas_anterior;
   CREATE TABLE invitaciones (
     usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id),
     token_hash TEXT NOT NULL UNIQUE,
     expira INTEGER NOT NULL
   );`,
  // Blancos del simulacro, modo (práctica o simulacro) y primera exposición. Las respuestas antiguas de
  // tests y repaso eran práctica; las de examen no se pueden clasificar y se quedan sin modo.
  `ALTER TABLE respuestas ADD COLUMN blanco INTEGER NOT NULL DEFAULT 0;
   ALTER TABLE respuestas ADD COLUMN modo TEXT;
   ALTER TABLE respuestas ADD COLUMN primera INTEGER NOT NULL DEFAULT 0;
   UPDATE respuestas SET modo = 'practica' WHERE origen IN ('test', 'repaso');
   UPDATE respuestas SET primera = 1 WHERE id = (
     SELECT r2.id FROM respuestas r2
     WHERE r2.usuario_id = respuestas.usuario_id AND r2.pregunta_id = respuestas.pregunta_id
     ORDER BY r2.ts, r2.id LIMIT 1);
   ALTER TABLE intentos ADD COLUMN modo TEXT;
   ALTER TABLE intentos ADD COLUMN limite INTEGER;
   ALTER TABLE intentos ADD COLUMN cliente_id TEXT;
   CREATE UNIQUE INDEX intentos_cliente ON intentos(usuario_id, cliente_id) WHERE cliente_id IS NOT NULL;`,
];

export type DB = Database.Database;

export function abrir(ruta: string): DB {
  if (ruta !== ':memory:') mkdirSync(dirname(ruta), { recursive: true });
  const db = new Database(ruta);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  const version = db.pragma('user_version', { simple: true }) as number;
  for (let v = version; v < MIGRACIONES.length; v++) {
    db.transaction(() => {
      db.exec(MIGRACIONES[v]);
      db.pragma(`user_version = ${v + 1}`);
    })();
  }
  return db;
}
