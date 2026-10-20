import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
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

export interface Usuario { id: number; nombre: string }

export function prepararCuentas(db: DB, passwordHash: string) {
  // La contraseña provisionada se importa una sola vez, sin imprimirla ni restablecer cuentas.
  db.prepare('UPDATE usuarios SET password_hash = ? WHERE id = 1 AND password_hash IS NULL').run(passwordHash);
}

export function crearSesion(db: DB, usuarioId = 1, ahora = Date.now()): string {
  const token = randomBytes(32).toString('base64url');
  db.prepare('DELETE FROM sesiones WHERE expira < ?').run(ahora);
  db.prepare('INSERT INTO sesiones (token, expira, usuario_id) VALUES (?, ?, ?)').run(token, ahora + DURACION_MS, usuarioId);
  return token;
}

export function usuarioDeSesion(db: DB, token: string | undefined, ahora = Date.now()): Usuario | undefined {
  if (!token) return undefined;
  return db.prepare(`SELECT u.id, u.nombre FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id
    WHERE s.token = ? AND s.expira > ? AND u.password_hash IS NOT NULL`).get(token, ahora) as Usuario | undefined;
}

export function sesionValida(db: DB, token: string | undefined, ahora = Date.now()): boolean {
  return usuarioDeSesion(db, token, ahora) !== undefined;
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export function crearInvitacion(db: DB, usuarioId: number) {
  const token = randomBytes(32).toString('base64url');
  const expira = Date.now() + 48 * 60 * 60 * 1000;
  db.prepare(`INSERT INTO invitaciones (usuario_id, token_hash, expira) VALUES (?, ?, ?)
    ON CONFLICT(usuario_id) DO UPDATE SET token_hash = excluded.token_hash, expira = excluded.expira`)
    .run(usuarioId, hashToken(token), expira);
  return { token, expira };
}

export async function activarCuenta(db: DB, token: string, password: string): Promise<Usuario | undefined> {
  const digest = hashToken(token);
  const vigente = () => db.prepare(`SELECT u.id, u.nombre FROM invitaciones i JOIN usuarios u ON u.id = i.usuario_id
    WHERE i.token_hash = ? AND i.expira > ? AND u.password_hash IS NULL`).get(digest, Date.now()) as Usuario | undefined;
  if (!vigente()) return undefined;
  const passwordHash = await hashear(password);
  return db.transaction(() => {
    // Revalidar tras scrypt: otra petición puede consumir el enlace o este puede caducar.
    const usuario = vigente();
    if (!usuario) return undefined;
    db.prepare('UPDATE usuarios SET password_hash = ? WHERE id = ? AND password_hash IS NULL').run(passwordHash, usuario.id);
    db.prepare('DELETE FROM invitaciones WHERE usuario_id = ?').run(usuario.id);
    return usuario;
  })();
}

export function cerrarSesion(db: DB, token: string | undefined) {
  if (token) db.prepare('DELETE FROM sesiones WHERE token = ?').run(token);
}
