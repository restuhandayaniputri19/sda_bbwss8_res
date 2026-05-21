import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { bearerAuth } from 'hono/bearer-auth';
import 'dotenv/config';
import { serveStatic } from '@hono/node-server/serve-static'

// Import Routes
import permintaanDataRoute from './routes/permintaan_data';
import prakiraanRoute from './routes/prakiraan';
import beritaRoute from './routes/berita';
import galeriRoute from './routes/galeri';
import auth from './routes/auth';

const app = new Hono().basePath('/balai/bbwssumatera8/api2');

// Middleware Global
app.use('*', logger()) // 2. Pasang sebagai middleware global

const API_TOKEN = process.env.API_TOKEN || 'slow-and-low-key';
//app.use('/api2/*', bearerAuth({ token: API_TOKEN }));
app.use('*', cors({
  origin: (origin, c) => {
    const frontend = process.env.CORS_ORIGIN || 'http://localhost:5173';
    // Jika origin cocok, atau tidak ada origin (berarti dari sumber yang sama/dev), izinkan.
    if (!origin || origin === frontend) {
      return origin || frontend;
    }
    return null;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// Endpoint untuk melihat semua daftar route
app.get('/debug-routes', (c) => {
  // app.routes berisi array objek route yang terdaftar
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

app.use('/uploads/*', serveStatic({ 
  root: process.cwd(), // Menunjuk ke root project Bapak
  rewriteRequestPath: (path) => path.replace(/^\/uploads/, '/uploads') 
}))

// Routing - Menghubungkan semua endpoint
app.route('/prakiraan', prakiraanRoute);
app.route('/berita', beritaRoute);
app.route('/auth', auth);
app.route('/permintaan-data', permintaanDataRoute);
app.route('/gallery', galeriRoute);

// app.route('/banner', bannerRoute);
// app.route('/galeri', galeriRoute);

app.get('/', (c) => c.text('Hono Backend2 API is Active!'));

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});