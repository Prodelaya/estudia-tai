// PM2: una sola app Node que sirve API, web y contenido. Lee secretos de ../.env.
// Uso: pm2 start deploy/ecosystem.config.cjs && pm2 save
const path = require('node:path');

module.exports = {
  apps: [{
    name: 'estudia-tai',
    cwd: path.join(__dirname, '..'),
    script: 'apps/api/dist/server.js',
    node_args: '--env-file=.env',
    env: {
      NODE_ENV: 'production',
      HOST: '127.0.0.1',
      PORT: '3002',
      WEB_DIR: 'apps/web/dist',
      CONTENT_DIR: 'content',
      DB_PATH: 'data/estudia-tai.db',
    },
  }],
};
