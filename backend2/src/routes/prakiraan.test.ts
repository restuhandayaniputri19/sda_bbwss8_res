import { describe, it, expect, vi, beforeEach } from 'vitest';
import prakiraan from './prakiraan'; // Sesuaikan path-nya
import fs from 'fs/promises';

// Mock fs untuk menghindari penulisan file nyata saat test
vi.mock('fs/promises');

describe('API Prakiraan Cuaca', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Harus mengembalikan data tersimpan (jalur Slow) saat fetch=false', async () => {
    const mockData = JSON.stringify({ 
      updated_at: '2026-04-22T10:00:00Z', 
      items: [{ lokasi: 'Solo', hari_ini: { kondisi: 'Cerah', suhu: '25–32 °C', kelembapan: '60–80%' } }] 
    });

    // Simulasi file ada dan terbaca
    vi.mocked(fs.readFile).mockResolvedValue(mockData);
    vi.mocked(fs.access).mockResolvedValue(undefined);

    const res = await prakiraan.request('/');
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.items[0].lokasi).toBe('Solo');
  });

  it('Harus melakukan scraping saat fetch=true', async () => {
    // Simulasi fetch ke BMKG agar tidak benar-benar memanggil internet
    const mockHTML = `
      <table>
        <tr><th>Kota</th><th>Hari Ini</th><th>Besok</th></tr>
        <tr><td>Semarang</td><td>Hujan Ringan24–33 °C70–95%</td><td>Cerah Berawan25–34 °C65–90%</td></tr>
      </table>
    `;
    
    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(mockHTML),
    });

    const res = await prakiraan.request('/?fetch=true');
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toBe('Scrape Berhasil');
    expect(body.data.items[0].lokasi).toBe('Semarang');
    
    // Verifikasi pemisahan regex (cleanWeatherData)
    expect(body.data.items[0].hari_ini.kondisi).toBe('Hujan Ringan');
    expect(body.data.items[0].hari_ini.suhu).toBe('24–33 °C');
    
    // Pastikan file ditulis secara atomik (rename)
    expect(fs.writeFile).toHaveBeenCalled();
    expect(fs.rename).toHaveBeenCalled();
  });

  it('Harus menangani error jika file tidak ditemukan', async () => {
    vi.mocked(fs.access).mockRejectedValue(new Error('Not Found'));
    vi.mocked(fs.readFile).mockRejectedValue(new Error('Not Found'));

    const res = await prakiraan.request('/');
    expect(res.status).toBe(404);
  });
});