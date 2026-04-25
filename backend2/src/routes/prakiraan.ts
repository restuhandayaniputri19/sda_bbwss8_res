import { Hono } from 'hono';
import { parseHTML } from 'linkedom';
import fs from 'fs/promises';

const prakiraan = new Hono();
const DATA_FILE = './data_prakiraan.json';
const BMKG_URL = 'https://www.bmkg.go.id/cuaca/prakiraan-cuaca/16';

// Helper untuk memastikan file ada saat pertama kali dijalankan
const ensureFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ updated_at: null, items: [] }));
  }
};

const cleanWeatherData = (rawText: string) => {
  // Regex untuk memisahkan Kondisi, Suhu, dan Kelembapan
  const regex = /^(.+?)(\d+–\d+ °C)(\d+–\d+%)$/;
  const match = rawText.match(regex);

  if (match) {
    return {
      kondisi: match[1].trim(),
      suhu: match[2].trim(),
      kelembapan: match[3].trim(),
    };
  }

  // Fallback jika format tidak sesuai
  return { kondisi: rawText, suhu: "-", kelembapan: "-" };
};

prakiraan.get('/', async (c) => {
  const isFetch = c.req.query('fetch') === 'true';
  console.log(`Endpoint /api/prakiraan diakses. fetch=${isFetch}`);
  if (isFetch) {
    try {
      // 1. Ambil data dari BMKG
      const response = await fetch(BMKG_URL);
      const html = await response.text();

      // 2. Parsing dengan Linkedom
      const { document } = parseHTML(html);
      const rows = document.querySelectorAll('table tr');

      const items = Array.from(rows).slice(1).map(row => {
        const cols = row.querySelectorAll('td');

        const baseUrl = 'https://www.bmkg.go.id';

        const cityLink = cols[0]?.querySelector('a');
        let relativeUrl = cityLink?.getAttribute('href') || '';

        if (relativeUrl && !relativeUrl.startsWith('/')) {
          relativeUrl = '/' + relativeUrl;
        }
        const fullUrl = relativeUrl
          ? new URL(relativeUrl, baseUrl).href
          : '-';

        const getIcon = (col) => {
          const svgElement = col?.querySelector('svg');
          if (!svgElement) return '-';

          // Mengambil string HTML dari elemen SVG tersebut
          // .toString() atau .outerHTML di Linkedom akan mengembalikan string <svg>...</svg>
          return svgElement.toString();
        };

        console.log('cols[2]:', cols[2]?.textContent);
        return {
          lokasi: cols[0]?.textContent?.trim() || 'Unknown',
          url_detail: fullUrl,
          hari_ini: {
            kondisi: cleanWeatherData(cols[1]?.textContent || '-'),
            ikon: getIcon(cols[1])
          },
          besok: {
            kondisi: cleanWeatherData(cols[2]?.textContent || '-'),
            ikon: getIcon(cols[2])
          }
        };
      });

      const payload = {
        updated_at: new Date().toISOString(),
        items
      };

      // 3. Simpan (Atomic Write untuk menghindari korupsi file)
      // Kita tulis ke file temp dulu, baru di-rename (tipikal Unix/Ubuntu style)
      await fs.writeFile(`${DATA_FILE}.tmp`, JSON.stringify(payload, null, 2));
      await fs.rename(`${DATA_FILE}.tmp`, DATA_FILE);

      return c.json({ success: true, message: 'Scrape Berhasil', data: payload });
    } catch (error) {
      console.error('Scraping Error:', error);
      return c.json({ success: false, error: 'Gagal mengambil data terbaru' }, 500);
    }
  }

  // Jalur "Slow": Ambil data yang sudah tersimpan
  try {
    await ensureFile();
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return c.json({ success: true, data: JSON.parse(raw) });
  } catch (err) {
    return c.json({ success: false, error: 'Data tidak ditemukan' }, 404);
  }
});

export default prakiraan;