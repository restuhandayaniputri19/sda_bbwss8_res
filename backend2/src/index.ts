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

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(origin => origin.trim());

app.use('*', cors({
  origin: origins,
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

// Letakkan di bawah app.get('/debug-routes', ...) Bapak

app.post('send-wa', async (c) => {
  try {
    const { to, msg } = await c.req.json();
    console.log("Endpoint /auth/send-wa diakses dengan data:", { to, msg });

     const isDev = true
     if (isDev) {
       console.log(`[DEV MODE] Pesan untuk ${to}: ${msg}`);
       return c.json({ success: true, message: "Pesan terkirim (DEV MODE)" }); // Kirim OTP di response untuk dev
     } else {
       console.log(`Pesan untuk ${to} disimpan di database. Mengirim pesan via WA...`);
       // 3. Panggil container wa-webjs (Internal network)
       const waResponse = await fetch("http://localhost:3003/send", { // Sesuaikan port/host container
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           to: to,
           msg: msg
         }),
       });
 
       const responseText = await waResponse.text();
       console.log('Respon Server WA:', responseText);
 
       if (!waResponse.ok) throw new Error("Gagal mengirim pesan via WA");
     }
 
     return c.json({ success: true, message: "Pesan terkirim" });
   } catch (error: any) {
     return c.json({ success: false, error: error.message }, 500);
   }
});

app.post('/test-send-wa', async (c) => {
  try {
    // 1. Ambil datetime saat ini dengan format lokal Indonesia yang rapi
    const currentDateTime = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'long',
      timeStyle: 'medium'
    });

    // 2. Siapkan payload data sesuai kebutuhan backend WA Bapak
    const payload = {
      to: "628997895139",
      msg: `Test OTP / Notification via Hono API2 - ${currentDateTime}`
    };

    console.log('--- Mencoba Mengirim WA Gateway ---');
    console.log('Target:', 'http://localhost:3003/send');
    console.log('Payload:', payload);

    // 3. Kirim HTTP POST menggunakan fetch bawaan
    const response = await fetch('http://localhost:3003/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Ambil respon dari server WA (jika ada kembalian teks/json)
    const responseText = await response.text();
    console.log('Respon Server WA:', responseText);

    if (!response.ok) {
      return c.json({
        status: false,
        message: `Server WA merespon dengan status: ${response.status}`,
        detail: responseText
      }, response.status);
    }

    return c.json({
      status: true,
      message: "Request kirim WA berhasil diteruskan ke gateway.",
      sentData: payload,
      gatewayResponse: responseText
    }, 200);

  } catch (error: any) {
    console.error('Gagal menghubungi WA Gateway:', error.message);
    return c.json({
      status: false,
      message: "Gagal menghubungkan ke service WA lokal",
      error: error.message
    }, 500);
  }
});

app.use('/uploads/*', serveStatic({ 
  root: process.cwd(), // Menunjuk ke root project Bapak
  rewriteRequestPath: (path) => path.replace(/^\/balai\/bbwssumatera8\/api2/, '')
}))

// Routing - Menghubungkan semua endpoint
app.route('/prakiraan', prakiraanRoute);
app.route('/berita', beritaRoute);
app.route('/auth', auth);
app.route('/permintaan-data', permintaanDataRoute);
app.route('/galeri', galeriRoute);

// app.route('/banner', bannerRoute);
// app.route('/galeri', galeriRoute);

app.get('/', (c) => c.text('Hono Backend2 API is Active!'));

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});