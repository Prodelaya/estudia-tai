# API: Fastify + SQLite. Se construye desde la raíz del repo (workspaces de npm).
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w apps/api --include-workspace-root=false
COPY apps/api apps/api
RUN npm run build -w apps/api && npm prune --omit=dev -w apps/api

FROM node:22-slim
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 DB_PATH=/data/estudia-tai.db
WORKDIR /app
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/api/package.json apps/api/
USER node
VOLUME /data
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]
