import { Hono } from 'hono';

const berita = new Hono();

export default berita;

berita.get('/', async (c) => {
  // Placeholder: Kembalikan data dummy untuk sementara
  const dummyData = {
    updated_at: new Date().toISOString(),
    items: [
      {
        id: 1,
        title: 'Berita Terkini 1',
        summary: 'Ringkasan berita terkini 1',
        url: 'https://example.com/berita1'
      },
      {
        id: 2,
        title: 'Berita Terkini 2',
        summary: 'Ringkasan berita terkini 2',
        url: 'https://example.com/berita2'
      }
    ]
  };

  return c.json({ success: true, data: dummyData });
});