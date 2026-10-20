import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, normalize, extname } from 'node:path';

const CONTENIDO = resolve(__dirname, '../../content');
const TIPOS: Record<string, string> = { '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };

// En desarrollo sirve ../../content en /data. En producción lo sirve Caddy, solo con sesión iniciada.
function contenido(): Plugin {
  return {
    name: 'contenido-dev',
    configureServer(server) {
      server.middlewares.use('/data', (req, res, next) => {
        const ruta = normalize(resolve(CONTENIDO, '.' + decodeURIComponent((req.url ?? '/').split('?')[0])));
        if (!ruta.startsWith(CONTENIDO) || !existsSync(ruta) || !statSync(ruta).isFile()) return next();
        res.setHeader('content-type', TIPOS[extname(ruta)] ?? 'application/octet-stream');
        createReadStream(ruta).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contenido()],
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
});
