import { hashear } from './auth.js';

const pw = process.argv[2];
if (!pw) {
  console.error("Uso: npm run hash-password -- 'tu-contraseña'");
  process.exit(1);
}
console.log(await hashear(pw));
