# Frontend estático servido por Caddy, que además hace de proxy de la API y sirve el contenido con sesión.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
RUN npm ci -w apps/web --include-workspace-root=false
COPY apps/web apps/web
RUN npm run build -w apps/web

FROM caddy:2
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/web/dist /srv/web
