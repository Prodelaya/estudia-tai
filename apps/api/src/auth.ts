import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { DB } from './db.js';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const COOKIE = 'tai_sesion';
export const DURACION_MS = 30 * 24 * 3600 * 1000;

// Formato del hash: scrypt:<sal hex>:<derivada hex> (sin «$», que Docker Compose interpretaría en .env)
export async function hashear(password: string): Promise<string> {
  const sal = randomBytes(16);
  const der = await scrypt(password, sal, 32);
  return `scrypt:${sal.toString('hex')}:${der.toString('hex')}`;
}

export async function verificar(password: string, hash: string): Promise<boolean> {
  const [alg, salHex, derHex] = hash.split(':');
  if (alg !== 'scrypt' || !salHex || !derHex) return false;
  const esperado = Buffer.from(derHex, 'hex');
  const der = await scrypt(password, Buffer.from(salHex, 'hex'), esperado.length);
  return timingSafeEqual(der, esperado);
}

export function crearSesion(db: DB, ahora = Date.now()): string {
  const token = randomBytes(32).toString('base64url');
  db.prepare('DELETE FROM sesiones WHERE expira < ?').run(ahora);
  db.prepare('INSERT INTO sesiones (token, expira) VALUES (?, ?)').run(token, ahora + DURACION_MS);
  return token;
}

export function sesionValida(db: DB, token: string | undefined, ahora = Date.now()): boolean {
  if (!token) return false;
  const fila = db.prepare('SELECT expira FROM sesiones WHERE token = ?').get(token) as { expira: number } | undefined;
  return !!fila && fila.expira > ahora;
}

export function cerrarSesion(db: DB, token: string | undefined) {
  if (token) db.prepare('DELETE FROM sesiones WHERE token = ?').run(token);
}
