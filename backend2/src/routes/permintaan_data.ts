import { Hono } from 'hono';
import { db } from '../db'; // Sesuaikan dengan lokasi inisialisasi db Bapak
import { permintaanData } from '../db/schema';
import { eq, and } from 'drizzle-orm';

const app = new Hono();

// 1. GET: Mendapatkan List Permintaan Data
app.get('/', async (c) => {
  try {
    const noWa = c.req.query('no_wa');

    let results;
    if (noWa) {
      // Jika ada param noWa, filter berdasarkan nomor telepon
      results = await db
        .select()
        .from(permintaanData)
        .where(eq(permintaanData.noWa, noWa))
        .all();
    } else {
      // Jika tidak ada, ambil semua (untuk kebutuhan internal/admin)
      results = await db.select().from(permintaanData).all();
    }

    return c.json({
      success: true,
      data: results
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
});

// 2. POST: Insert Data Baru
app.post('/', async (c) => {
  try {
    const body = await c.req.json();

    // Validasi sederhana atau gunakan Zod jika diperlukan
    const result = await db.insert(permintaanData).values({
      namaLengkap: body.namaLengkap,
      instansi: body.instansi,
      jenisData: body.jenisData,
      periodeDari: body.periodeDari,
      periodeSampai: body.periodeSampai,
      email: body.email,
      noWa: body.noWa ?? body.noTelepon,
      tujuanPenggunaan: body.tujuanPenggunaan,
      fileSurat: body.fileSurat,
      status: 'pending', // Default status
      statusLogs: [{ 
        status: 'pending', 
        timestamp: new Date().toISOString(), 
        note: 'Permohonan berhasil dibuat' 
      }]
    }).returning(); // Mengembalikan data yang baru saja di-insert

    return c.json({
      success: true,
      data: result[0]
    }, 201);
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 400);
  }
});

// PATCH: Update Status & Menambah Status Logs
app.patch('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json(); // { status, note }

    // 1. Ambil data lama untuk mendapatkan statusLogs saat ini
    const existing = await db
      .select()
      .from(permintaanData)
      .where(eq(permintaanData.id, id))
      .get(); // Gunakan .get() untuk mengambil satu objek di SQLite

    if (!existing) {
      return c.json({ success: false, message: 'Data tidak ditemukan' }, 404);
    }

    // 2. Siapkan Log Baru
    const newLog = {
      status: body.status || existing.status,
      timestamp: new Date().toISOString(),
      note: body.note || `Status diperbarui menjadi ${body.status}`
    };

    // 3. Gabungkan log lama dengan log baru (Immutability)
    const updatedLogs = [...(existing.statusLogs || []), newLog];

    // 4. Update Database
    const result = await db
      .update(permintaanData)
      .set({
        status: body.status || existing.status,
        statusLogs: updatedLogs,
        updatedAt: new Date() // Pastikan kolom updatedAt ikut terisi
      })
      .where(eq(permintaanData.id, id))
      .returning();

    return c.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default app;