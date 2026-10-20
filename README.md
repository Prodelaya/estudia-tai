# Estudia TAI

Web personal de repaso para la oposición TAI (Técnico Auxiliar de Informática de la AGE, acceso libre), centrada en 18 temas: 1, 11–24 (bloque III entero), 28, 29 y 30.

- **Lecciones** de cada tema con índice lateral.
- **Tests por tema**: preguntas que han salido en exámenes reales, una variante de cada una y 25 posibles preguntas nuevas, todas con explicación.
- **Tarjetas** con repetición espaciada (SM-2).
- **Repaso diario**: tarjetas que vencen hoy y preguntas falladas.
- **Simulacros** con exámenes reales (test + supuesto del bloque III), hoja de respuestas, temporizador y corrección según las bases (−1/3 por error, reservas que sustituyen anuladas, 25/50 por parte).
- **Dudas**: lista de claves que marcas como sospechosas para revisarlas.

## Arquitectura

```
Navegador ──HTTPS──> Caddy ──┬─ /            → SPA React (estática)
                             ├─ /api/*       → API Fastify ── SQLite (progreso)
                             └─ /data/*      → content/ (solo con sesión: forward_auth a /api/auth/check)
```

```
apps/api      Fastify 5 + better-sqlite3: login de un usuario, progreso, intentos, tarjetas, dudas
apps/web      Vite + React 19 + TypeScript
content       datos de estudio (JSON + Markdown): temas, lecciones, exámenes, contenido por tema, imágenes
deploy        Dockerfiles y Caddyfile
scripts       validar-contenido.mjs
```

El contenido es estático y versionado en el repo; el único estado es tu progreso, en `/data/estudia-tai.db` dentro del volumen `api-data`.

## Desarrollo

```bash
npm install
npm run dev            # API en :3000 y web en :5173 (contraseña de desarrollo: tai)
npm run check          # tipos + validación del contenido
npm test
```

## Despliegue en tu servidor Ubuntu

Requisitos: Docker con el plugin compose, y un registro DNS A/AAAA de tu dominio apuntando al servidor con los puertos 80 y 443 abiertos (Caddy saca el certificado de Let's Encrypt solo).

```bash
git clone https://github.com/Prodelaya/estudia-tai && cd estudia-tai
cp .env.example .env
npm install && npm run hash-password -- 'tu-contraseña'   # o con Docker: ver abajo
# pega el hash en APP_PASSWORD_HASH, pon tu dominio en DOMAIN y un secreto en SESSION_SECRET (openssl rand -hex 32)
docker compose up -d --build
```

Sin Node en el servidor, el hash se puede sacar con Docker:

```bash
docker run --rm -v "$PWD/apps/api:/a" -w /a node:22-slim sh -c "npm i -s tsx && npx tsx src/hash-password.ts 'tu-contraseña'"
```

Actualizar: `git pull && docker compose up -d --build`. El contenido se monta desde `./content`, así que los cambios de contenido solo necesitan `git pull`.

Copia de seguridad del progreso: botón de exportar (`/api/export`) o `docker compose cp api:/data/estudia-tai.db ./backup.db`.

### Si ya tienes otro proxy inverso (Nginx, Traefik…)

Quita el servicio `web` o cambia sus puertos, y replica las tres reglas del `deploy/Caddyfile`: `/api/*` a la API, `/data/*` desde `content/` con autenticación delegada en `GET /api/auth/check` (204 = sesión válida, 401 = no) y el resto a `apps/web/dist` con fallback a `index.html`.

## Fiabilidad de las claves

Cada pregunta indica de dónde sale su respuesta: plantilla oficial definitiva, oficial provisional o resuelta por Claude (y si es dudosa). Las discrepancias detectadas entre la plantilla oficial y lo que dice la normativa se explican en la propia pregunta.
