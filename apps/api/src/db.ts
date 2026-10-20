import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// Un único usuario: no hay tabla de usuarios. Las migraciones se aplican en orden y se anotan en user_version.
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
