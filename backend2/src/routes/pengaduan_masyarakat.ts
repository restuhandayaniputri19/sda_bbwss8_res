import { Hono } from 'hono';
import { db } from '../db'; // Sesuaikan dengan path database Anda
import { pengaduanMasyarakat } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const app = new Hono();
const ALLOWED_ATTACHMENT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
const ALLOWED_ATTACHMENT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

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
    const body = await c.req.parseBody();
    const namaPelapor = typeof body.namaPelapor === 'string' ? body.namaPelapor.trim() : '';
    const noWaValue = body.noWa ?? body.telepon;
    const noWa = typeof noWaValue === 'string' ? noWaValue.trim() : '';
    const kategori = typeof body.kategori === 'string' ? body.kategori.trim() : '';
    const lokasi = typeof body.lokasi === 'string' ? body.lokasi.trim() : '';
    const deskripsi = typeof body.deskripsi === 'string' ? body.deskripsi.trim() : '';
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const allowedCategories = ['banjir', 'infrastruktur', 'perizinan', 'lainnya'];

    if (!namaPelapor || !noWa || !allowedCategories.includes(kategori) || !lokasi || !deskripsi) {
      return c.json({ success: false, message: 'Nama, telepon, kategori, lokasi, dan deskripsi wajib diisi.' }, 400);
    }
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      return c.json({ success: false, message: 'Titik lokasi pengaduan wajib dipilih dari peta atau lokasi perangkat.' }, 400);
    }

    const fileValue = body.fileLampiran;
    const file = fileValue && typeof fileValue !== 'string' && fileValue instanceof File && fileValue.size > 0
      ? fileValue
      : null;
    let filePath: string | null = null;

    if (file) {
      const extension = path.extname(file.name).toLowerCase();
      if (file.size > MAX_ATTACHMENT_SIZE) {
        return c.json({ success: false, message: 'Ukuran lampiran maksimal 5 MB.' }, 400);
      }
      if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension) || (file.type && !ALLOWED_ATTACHMENT_MIME_TYPES.includes(file.type))) {
        return c.json({ success: false, message: 'Format lampiran yang didukung: JPG, PNG, PDF, DOC, atau DOCX.' }, 400);
      }

      const uploadDir = path.resolve(process.cwd(), 'uploads', 'pengaduan-masyarakat');
      await mkdir(uploadDir, { recursive: true });
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storedFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${cleanFileName}`;
      const fullPath = path.join(uploadDir, storedFileName);
      const arrayBuffer = await file.arrayBuffer();
      await writeFile(fullPath, Buffer.from(arrayBuffer));
      filePath = `/uploads/pengaduan-masyarakat/${storedFileName}`;
    }

    const result = await db.insert(pengaduanMasyarakat).values({
      namaPelapor,
      noWa,
      email: email || null,
      kategori: kategori as 'banjir' | 'infrastruktur' | 'perizinan' | 'lainnya',
      lokasi,
      latitude,
      longitude,
      deskripsi,
      fileLampiran: filePath,
      status: 'pending',
      statusLogs: [{
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'Pengaduan berhasil dibuat'
      }]
    }).returning();

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
