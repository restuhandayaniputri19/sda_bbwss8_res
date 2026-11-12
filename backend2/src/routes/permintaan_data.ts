import { Hono } from 'hono';
import { db } from '../db';
import { permintaanData } from '../db/schema';
import { eq, desc, and, type SQL } from 'drizzle-orm';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const app = new Hono();

const VALID_STATUSES = ['pending', 'diproses', 'selesai', 'ditolak'] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

// 1. GET: Mendapatkan List Permintaan Data
app.get('/', async (c) => {
  try {
    const noWa = c.req.query('no_wa');
    const status = c.req.query('status');

    const conditions: SQL[] = [];

    if (noWa) {
      conditions.push(eq(permintaanData.noWa, noWa));
    }

    if (status && VALID_STATUSES.includes(status as ValidStatus)) {
      conditions.push(eq(permintaanData.status, status as ValidStatus));
    }

    const results = await db
      .select()
      .from(permintaanData)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(permintaanData.createdAt), desc(permintaanData.id))
      .all();

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
    const body = await c.req.parseBody();
    console.log("Data yang diterima untuk permintaan baru:", body);

    let filePath: string | null = null;
    const file = body['fileSurat'] || body['file'];

    // Konfigurasi aturan validasi file
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const ALLOWED_MIME_TYPES = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

    // Validasi & Simpan File
    if (file && typeof file !== 'string') {
      const fileObject = file as File;

      // A. Validasi Ukuran File
      if (fileObject.size > MAX_FILE_SIZE) {
        return c.json({
          success: false,
          message: 'Ukuran file terlalu besar! Maksimal ukuran file adalah 5 MB.'
        }, 400);
      }

      // B. Validasi Ekstensi / Tipe MIME File
      const fileExt = path.extname(fileObject.name).toLowerCase();
      const fileMime = fileObject.type;

      const isMimeValid = ALLOWED_MIME_TYPES.includes(fileMime);
      const isExtValid = ALLOWED_EXTENSIONS.includes(fileExt);

      if (!isMimeValid || !isExtValid) {
        return c.json({
          success: false,
          message: 'Format file tidak didukung! Harap unggah file berformat PDF, JPG, JPEG, atau PNG.'
        }, 400);
      }

      // C. Simpan File ke Disk
      const uploadDir = path.resolve(process.cwd(), 'uploads', 'surat');
      await mkdir(uploadDir, { recursive: true });

      const cleanFileName = fileObject.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${cleanFileName}`;
      const fullPath = path.join(uploadDir, fileName);

      const arrayBuffer = await fileObject.arrayBuffer();
      await writeFile(fullPath, Buffer.from(arrayBuffer));

      filePath = `/uploads/surat/${fileName}`;
    } else {
      return c.json({
        success: false,
        message: 'File surat permohonan wajib diunggah!'
      }, 400);
    }

    // Insert Data ke Database (Menggunakan filePath, bukan body.fileSurat)
    const result = await db.insert(permintaanData).values({
      namaLengkap: body.namaLengkap as string,
      instansi: body.instansi as string,
      jenisData: body.jenisData as string,
      periodeDari: body.periodeDari as string,
      periodeSampai: body.periodeSampai as string,
      email: body.email as string,
      noWa: (body.noWa ?? body.noTelepon) as string,
      tujuanPenggunaan: body.tujuanPenggunaan as string,
      fileSurat: filePath, // <-- Diperbaiki: simpan path string URL-nya
      status: 'pending',
      statusLogs: [{
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'Permohonan berhasil dibuat'
      }]
    }).returning();

    return c.json({
      success: true,
      data: result[0]
    }, 201);
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 400);
  }
});

// 3. PATCH: Update Status & Menambah Status Logs
app.patch('/:id/status', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();

    const existing = await db
      .select()
      .from(permintaanData)
      .where(eq(permintaanData.id, id))
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
      .update(permintaanData)
      .set({
        status: body.status || existing.status,
        statusLogs: updatedLogs,
        updatedAt: new Date()
      })
      .where(eq(permintaanData.id, id))
      .returning();

    return c.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 400);
  }
});

// 4. GET BY ID: Detail Permintaan Data
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ success: false, message: 'ID tidak valid' }, 400);
    }

    const result = await db
      .select()
      .from(permintaanData)
      .where(eq(permintaanData.id, id))
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

export default app;