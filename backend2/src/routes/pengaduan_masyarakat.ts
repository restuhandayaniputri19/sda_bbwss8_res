import { Hono } from 'hono';
import { db } from '../db'; // Sesuaikan dengan path database Anda
import { pengaduanMasyarakat } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const app = new Hono();

// 1. GET: List Pengaduan (Filter no_wa atau Ambil Semua)
app.get('/', async (c) => {
  try {
    const noWa = c.req.query('no_wa');
    console.log(`Mencari pengaduan dengan no_wa: ${noWa}`); // Debug log untuk memastikan query parameter diterima dengan benar

    let results;
    if (noWa) {
      results = await db
        .select()
        .from(pengaduanMasyarakat)
        .where(eq(pengaduanMasyarakat.noWa, noWa))
        .orderBy(desc(pengaduanMasyarakat.createdAt))
        .all();
    } else {
      results = await db
        .select()
        .from(pengaduanMasyarakat)
        .orderBy(desc(pengaduanMasyarakat.createdAt))
        .all();
    }

    return c.json({
      success: true,
      data: results
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
});

// 2. GET: Detail Pengaduan Berdasarkan ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);

    if (isNaN(id)) {
      return c.json({ success: false, message: 'ID tidak valid' }, 400);
    }

    const result = await db
      .select()
      .from(pengaduanMasyarakat)
      .where(eq(pengaduanMasyarakat.id, id))
      .get();

    if (!result) {
      return c.json({ success: false, message: 'Data tidak ditemukan' }, 404);
    }

    return c.json({
      success: true,
      data: result
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
});

// 3. POST: Insert Pengaduan Baru
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    console.log("Data yang diterima untuk pengaduan baru:", body); // Debug log untuk melihat data yang masuk

    const result = await db
      .insert(pengaduanMasyarakat)
      .values({
        namaPelapor: body.namaPelapor,
        noWa: body.noWa ?? body.telepon,
        email: body.email || null,
        kategori: body.kategori,
        lokasi: body.lokasi,
        deskripsi: body.deskripsi,
        fileLampiran: body.fileLampiran || null,
        status: 'pending',
        statusLogs: [
          {
            status: 'pending',
            timestamp: new Date().toISOString(),
            note: 'Pengaduan berhasil dibuat'
          }
        ]
      })
      .returning();

    return c.json(
      {
        success: true,
        data: result[0]
      },
      201
    );
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 400);
  }
});

// 4. PATCH: Update Status & Log Catatan Penanganan
app.patch('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json(); // { status, note }

    if (isNaN(id)) {
      return c.json({ success: false, message: 'ID tidak valid' }, 400);
    }

    const existing = await db
      .select()
      .from(pengaduanMasyarakat)
      .where(eq(pengaduanMasyarakat.id, id))
      .get();

    if (!existing) {
      return c.json({ success: false, message: 'Data tidak ditemukan' }, 404);
    }

    const newLog = {
      status: body.status || existing.status,
      timestamp: new Date().toISOString(),
      note: body.note || `Status diperbarui menjadi ${body.status}`
    };

    const updatedLogs = [...(existing.statusLogs || []), newLog];

    const result = await db
      .update(pengaduanMasyarakat)
      .set({
        status: body.status || existing.status,
        statusLogs: updatedLogs,
        updatedAt: new Date()
      })
      .where(eq(pengaduanMasyarakat.id, id))
      .returning();

    return c.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 400);
  }
});

export default app;