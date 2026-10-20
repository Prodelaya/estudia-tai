import { abrir } from './db.js';
import { crearApp } from './app.js';
import { hashear } from './auth.js';

const env = process.env;
const produccion = env.NODE_ENV === 'production';

let passwordHash = env.APP_PASSWORD_HASH ?? '';
let secreto = env.SESSION_SECRET ?? '';
if (produccion && (!passwordHash || secreto.length < 32)) {
  console.error('Faltan APP_PASSWORD_HASH o SESSION_SECRET (32+ caracteres). Revisa .env.');
  process.exit(1);
}
if (!produccion) {
  // En desarrollo la contraseña es "tai" salvo que se configure otra.
  passwordHash ||= await hashear('tai');
  secreto ||= 'desarrollo-'.padEnd(40, 'x');
}

const db = abrir(env.DB_PATH ?? 'data/estudia-tai.db');
const app = await crearApp({
  db, passwordHash, secreto, cookieSegura: produccion, logger: true,
  dirWeb: env.WEB_DIR || undefined,
  dirContenido: env.CONTENT_DIR || undefined,
});
await app.listen({ host: env.HOST ?? '127.0.0.1', port: Number(env.PORT ?? 3000) });

for (const s of ['SIGINT', 'SIGTERM'] as const) process.on(s, async () => { await app.close(); db.close(); process.exit(0); });
