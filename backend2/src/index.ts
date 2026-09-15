import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serveStatic } from '@hono/node-server/serve-static';

// Import Routes
import kesiapsiagaanBencanaRoute from './routes/kesiapsiagaan_bencana';
import pengaduanMasyarakatRoute from './routes/pengaduan_masyarakat';
import infografisRoute from './routes/infografis';
import permintaanDataRoute from './routes/permintaan_data';
import prakiraanRoute from './routes/prakiraan';
import beritaRoute from './routes/berita';
import galeriRoute from './routes/galeri';
import geolocationRoute from './routes/geolocation';
import bannersRoute from './routes/banner';
import auth from './routes/auth';

import { swaggerUI } from '@hono/swagger-ui';
import openApiSpec from './openapi.json';
import adminLogsRoute from './routes/admin_logs';
import manageUsers from './routes/users';

const app = new Hono().basePath('/balai/bbwssumatera8/api');

// Middleware Global
app.use('*', logger());

// 1. CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  '*',
  cors({
    origin: (incomingOrigin) => {
      if (incomingOrigin) {
        return incomingOrigin;
      }
      return allowedOrigins[0];
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'Authorization'],
    maxAge: 600,
  })
);

// 2. Preflight Options
app.options('*', (c) => {
  return c.text('', 204);
});

// Swagger UI & OpenApi JSON
app.get('/docs', swaggerUI({ url: '/balai/bbwssumatera8/api/docs.json' }));
app.get('/docs.json', (c) => c.json(openApiSpec));

// Debug Routes
app.get('/debug-routes', (c) => {
  const allRoutes = app.routes.map((r) => ({
    method: r.method,
    path: r.path,
  }));

  return c.json({
    status: true,
    total: allRoutes.length,
    routes: allRoutes,
  });
});

// Serving Static Files
app.use('/uploads/*', serveStatic({ 
  root: process.cwd(),
  rewriteRequestPath: (path) => path.replace(/^\/balai\/bbwssumatera8\/api/, '')
}));

// Routing Internal Hono (SQLite)
app.route('/pengaduan-masyarakat', pengaduanMasyarakatRoute);
app.route('/infografis', infografisRoute);
app.route('/kesiapsiagaan-bencana', kesiapsiagaanBencanaRoute);
app.route('/prakiraan', prakiraanRoute);
app.route('/berita', beritaRoute);
app.route('/banner', bannersRoute);
app.route('/geolocations', geolocationRoute);
app.route('/auth', auth);
app.route('/permintaan-data', permintaanDataRoute);
app.route('/galeri', galeriRoute);
app.route('/admin-logs', adminLogsRoute);
app.route('/users', manageUsers);

app.get('/', (c) => c.text('Hono Backend API is Active!'));

// Custom 404 Handler (Menangani endpoint yang tidak terdaftar)
app.notFound((c) => {
  return c.json({ status: false, message: 'Endpoint Not Found' }, 404);
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

// Eksport instance Hono agar bisa di-import oleh script generator OpenAPI / Testing
export default app;