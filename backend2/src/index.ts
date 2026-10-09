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
import informasiRoute from './routes/informasi';
import pengumumanRoute from './routes/pengumuman';
import youtubeRoute from './routes/youtube';
import majalahRoute from './routes/majalah';
import polarencanaRoute from './routes/polarencana';

import { swaggerUI } from '@hono/swagger-ui';
import openApiSpec from './openapi.json';
import adminLogsRoute from './routes/admin_logs';
import manageUsers from './routes/users';
import { API_BASE_PATH, PUBLIC_BASE_PATH } from './lib/public-url';

const app = new Hono();
const api = new Hono().basePath(API_BASE_PATH);

// Middleware Global
app.use('*', logger());

// ==========================================
// DRIZZLE STUDIO REDIRECT (/dbshell)
// Dipasang di 'app' root agar URL-nya murni /dbshell
// ==========================================
api.get('/dbshell', (c) => {
  const host = c.req.header('host')?.split(':')[0] || 'localhost';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  // Mengarahkan langsung ke Drizzle Studio (Port 4983)
  const studioUrl = `${protocol}://${host}:4983`;
  return c.redirect(studioUrl);
});

// 1. CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

api.use(
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
api.options('*', (c) => {
  return new Response(null, { status: 204 });
});

// Swagger UI & OpenApi JSON
api.get('/docs', swaggerUI({ url: `${API_BASE_PATH}/docs.json` }));
api.get('/docs.json', (c) => c.json(openApiSpec));

// Debug Routes
api.get('/debug-routes', (c) => {
  const allRoutes = api.routes.map((r) => ({
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
app.use('/uploads/*', serveStatic({ root: process.cwd() }));
app.use(`${PUBLIC_BASE_PATH}/uploads/*`, serveStatic({
  root: process.cwd(),
  rewriteRequestPath: (path) => path.replace(PUBLIC_BASE_PATH, '')
}));
app.use(`${API_BASE_PATH}/uploads/*`, serveStatic({
  root: process.cwd(),
  rewriteRequestPath: (path) => path.replace(API_BASE_PATH, '')
}));

// Routing Internal Hono (SQLite)
api.route('/pengaduan-masyarakat', pengaduanMasyarakatRoute);
api.route('/infografis', infografisRoute);
api.route('/kesiapsiagaan-bencana', kesiapsiagaanBencanaRoute);
api.route('/prakiraan', prakiraanRoute);
api.route('/berita', beritaRoute);
api.route('/banner', bannersRoute);
api.route('/geolocations', geolocationRoute);
api.route('/auth', auth);
api.route('/permintaan-data', permintaanDataRoute);
api.route('/galeri', galeriRoute);
api.route('/informasi', informasiRoute);
api.route('/admin-logs', adminLogsRoute);
api.route('/users', manageUsers);
api.route('/pengumuman', pengumumanRoute);
api.route('/youtube', youtubeRoute);
api.route('/majalah', majalahRoute);
api.route('/pola-rencana', polarencanaRoute);
api.get('/', (c) => c.text('Hono Backend API is Active!'));

// Custom 404 Handler (Menangani endpoint yang tidak terdaftar)
api.notFound((c) => {
  return c.json({ status: false, message: 'Endpoint Not Found' }, 404);
});

app.route('/', api);

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

// Eksport instance Hono agar bisa di-import oleh script generator OpenAPI / Testing
export default app;