import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bearerAuth } from 'hono/bearer-auth';
import 'dotenv/config';

// Import Routes
import permintaanDataRoute from './routes/permintaan_data';
import prakiraanRoute from './routes/prakiraan';
import beritaRoute from './routes/berita';
import auth from './routes/auth';

const app = new Hono().basePath('/balai/bbwssumatera8/api2');

// Middleware Global
const API_TOKEN = process.env.API_TOKEN || 'slow-and-low-key';
//app.use('/api2/*', bearerAuth({ token: API_TOKEN }));
app.use('*', cors({
origin: (origin, c) => {
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Jika origin cocok, atau tidak ada origin (berarti dari sumber yang sama/dev), izinkan.
    if (!origin || origin === frontend) {
      return origin || frontend; 
    }
    return null;
  },
  credentials: true,
}));

// Routing - Menghubungkan semua endpoint
app.route('/prakiraan', prakiraanRoute);
app.route('/berita', beritaRoute);
app.route('/auth', auth);
app.route('/permintaan-data', permintaanDataRoute);

// app.route('/banner', bannerRoute);
// app.route('/galeri', galeriRoute);

app.get('/', (c) => c.text('Hono Backend2 API is Active!'));

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});