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
import auth from './routes/auth';

import { swaggerUI } from '@hono/swagger-ui';
import openApiSpec from './openapi.json';
import adminLogsRoute from './routes/admin_logs';
import manageUsers from './routes/users';

const app = new Hono().basePath('/balai/bbwssumatera8/api');

// Middleware Global
app.use('*', logger());

// 1. KORSE MURNI (Kembalikan origin pemanggil secara eksplisit, BUKAN '*')
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  '*',
  cors({
    origin: (incomingOrigin) => {
      // Jika request membawa origin (seperti dari browser), kembalikan origin tersebut
      // Ini menyelesaikan masalah `credentials: true` yang bentrok dengan wildcard `*`
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

// 2. TANGANI PREFLIGHT OPTIONS UNTUK SEMUA ROUTE SECARA EKSPLISIT
app.options('*', (c) => {
  return c.text('', 204);
});

// Swagger UI
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

app.use('/uploads/*', serveStatic({ 
  root: process.cwd(),
  rewriteRequestPath: (path) => path.replace(/^\/balai\/bbwssumatera8\/api/, '')
}));

// Routing Internal Hono (SQLite)
app.route('/pengaduan-masyarakat', pengaduanMasyarakatRoute);
app.route('/infografis', infografisRoute);
app.route('/kesiapsiagaan-bencana', kesiapsiagaanBencanaRoute);
app.route('/prakiraan', prakiraanRoute);
// app.route('/berita', beritaRoute); // Nonaktifkan agar masuk ke proxy A.com
app.route('/auth', auth);
app.route('/permintaan-data', permintaanDataRoute);
app.route('/galeri', galeriRoute);
app.route('/admin-logs', adminLogsRoute);
app.route('/users', manageUsers);

app.get('/', (c) => c.text('Hono Backend API is Active!'));

// =================================================================
// FALLBACK PROXY KE A.COM (Wajib di Paling Bawah)
// =================================================================
app.all('*', async (c) => {
  const rawPath = c.req.path; 
  const cleanPath = rawPath.replace(/^\/balai\/bbwssumatera8\/api/, '');
  const queryString = new URL(c.req.url).search;
  const targetUrl = `https://sda.pu.go.id/balai/bbwssumatera8/api${cleanPath}${queryString}`;

  console.log(`[PROXY MANUAL] ${c.req.method} ${rawPath}${queryString} -> ${targetUrl}`);

  const headers = new Headers(c.req.raw.headers);
  headers.delete('host');

  try {
    const response = await fetch(targetUrl, {
      method: c.req.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(c.req.method) 
        ? undefined 
        : await c.req.raw.clone().arrayBuffer(),
    });

    // Copy response header dari A.com
    const resHeaders = new Headers(response.headers);
    
    // Pastikan CORS header dari Hono tetap terbawa ke Browser
    const requestOrigin = c.req.header('origin') || '*';
    resHeaders.set('Access-Control-Allow-Origin', requestOrigin);
    resHeaders.set('Access-Control-Allow-Credentials', 'true');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error(`[PROXY ERROR] ${err.message}`);
    return c.json({ status: false, message: 'Gagal terhubung ke upstream API' }, 502);
  }
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});