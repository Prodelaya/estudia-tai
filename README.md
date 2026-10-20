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

## Cuentas personales e invitaciones

Las cuentas de esta instalación son `laya92`, `nosa` y `jota`. Cada una tiene su propio progreso, tarjetas, intentos, dudas y exportaciones; comparten únicamente el contenido de estudio.

- Al actualizar por primera vez, el progreso y las sesiones anteriores se asignan a `laya92`. Su contraseña sigue siendo la ya provisionada. El hash de `APP_PASSWORD_HASH` se importa internamente una sola vez: reiniciar o cambiar esa variable después no restablece contraseñas existentes.
- `nosa` y `jota` no pueden entrar hasta elegir una contraseña mediante invitación. No existe registro público ni contraseña inicial compartida.
- Entra como `laya92`, abre **Usuarios** y genera una invitación para cada persona. Copia el enlace y envíalo únicamente a su destinatario por un canal privado. No publiques enlaces en logs o incidencias.
- Cada enlace caduca en 48 horas y se consume una sola vez. Renovar una invitación invalida la anterior. No permite restablecer una cuenta ya activa.
- El destinatario abre el enlace HTTPS y elige y confirma su contraseña (12–200 caracteres). Después entra con su nombre de usuario y esa contraseña.
- El secreto del enlace viaja en el fragmento `#`, no en la ruta ni en la consulta HTTP; el navegador lo retira de la dirección y lo envía únicamente en el cuerpo de la activación. La base guarda solo su hash.

Antes de desplegar una actualización con migración, detén el servicio y conserva una copia privada recuperable de la base SQLite y del código anterior. No copies únicamente el fichero principal de una SQLite activa con WAL. No es necesario cambiar `.env`, Node ni el túnel para activar esta funcionalidad. No ejecutes la migración sobre producción como prueba.

## Despliegue con PM2 y Cloudflare Tunnel (sin Docker ni puertos abiertos)

Es el montaje recomendado si el servidor ya usa PM2 y un túnel de Cloudflare. Un solo proceso Node sirve la API, la web y el contenido (este solo con sesión) en `127.0.0.1:3002`, y el túnel lo publica con HTTPS.

```bash
git clone https://github.com/Prodelaya/estudia-tai && cd estudia-tai
npm ci && npm run build
cp .env.example .env    # rellena APP_PASSWORD_HASH (npm run hash-password -- 'tu-contraseña') y SESSION_SECRET (openssl rand -hex 32); DOMAIN no se usa aquí
pm2 start deploy/ecosystem.config.cjs && pm2 save
```

En el túnel, añade una regla de entrada antes de la regla final `http_status:404` de `~/.cloudflared/config.yml`:

```yaml
  - hostname: tai.prodelaya.dev
    service: http://localhost:3002
```

Después ejecuta `cloudflared tunnel route dns <tu-túnel> tai.prodelaya.dev` y reinicia el túnel.

Si el servidor usa systemd en vez de PM2, usa `deploy/estudia-tai.service` (instrucciones dentro del fichero) en lugar del paso de `pm2`.

Para actualizar: `git pull && npm ci && npm run build && pm2 restart estudia-tai` (o `sudo systemctl restart estudia-tai`). Si solo ha cambiado `content/`, basta con `git pull`.

## Despliegue con Docker Compose y Caddy (servidor con los puertos 80 y 443 libres)

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
