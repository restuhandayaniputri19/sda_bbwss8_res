import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bearerAuth } from 'hono/bearer-auth';
import 'dotenv/config';

// Import Routes
import prakiraanRoute from './routes/prakiraan';
import beritaRoute from './routes/berita';
// import bannerRoute from './routes/banner';
// import galeriRoute from './routes/galeri';

const app = new Hono();

// Middleware Global
const API_TOKEN = process.env.API_TOKEN || 'slow-and-low-key';
app.use('/api/*', bearerAuth({ token: API_TOKEN }));
app.use('/api/*', cors({
  origin: (origin) => {
    const allowed = [process.env.FRONTEND_URL || 'http://localhost:5173'];
    return allowed.includes(origin) ? origin : null;
  }
}));

// Routing - Menghubungkan semua endpoint
app.route('/api/prakiraan', prakiraanRoute);
app.route('/api/berita', beritaRoute);
// app.route('/api/banner', bannerRoute);
// app.route('/api/galeri', galeriRoute);

app.get('/', (c) => c.text('Hono Backend2 API is Active!'));

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});