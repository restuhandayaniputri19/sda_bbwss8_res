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

// 3. PATCH: Update Status, Menambah Status Logs & Kirim Notifikasi WA
app.patch('/:id/status', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();

    const existing = await db
      .select()
      .from(permintaanData)
      .where(eq(permintaanData.id, id))
      .get();

    if (!existing) {
      return c.json({ success: false, message: 'Data tidak ditemukan' }, 404);
    }

    const newStatus = body.status || existing.status;
    const noteText = body.note || `Status diperbarui menjadi ${newStatus}`;

    const newLog = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: noteText
    };

    const updatedLogs = [...(existing.statusLogs || []), newLog];

    // 1. Update database terlebih dahulu
    const result = await db
      .update(permintaanData)
      .set({
        status: newStatus,
        statusLogs: updatedLogs,
        updatedAt: new Date()
      })
      .where(eq(permintaanData.id, id))
      .returning();

    // 2. Kirim Notifikasi WA jika status berubah dan nomor WA tersedia
    if (existing.noWa && body.status && body.status !== existing.status) {
      // Normalisasi nomor: hilangkan '+', ubah awalan '0' menjadi '62'
      const cleanPhone = existing.noWa
        .trim()
        .replace(/^\+/, '')
        .replace(/^0/, '62')
        .replace(/\D/g, '');

      const pesanWa = [
        `*[BBWS Sumatera VIII] Update Permohonan Data*`,
        ``,
        `Halo *${existing.namaLengkap}*,`,
        `Status permohonan data Anda telah diperbarui:`,
        `• *ID Permohonan:* #${existing.id}`,
        `• *Jenis Data:* ${existing.jenisData}`,
        `• *Status Baru:* *${newStatus.toUpperCase()}*`,
        body.note ? `• *Catatan:* ${body.note}` : null,
        ``,
        `Terima kasih.`
      ]
        .filter(Boolean)
        .join('\n');

      try {
        const waResponse = await fetch(`${process.env.WA_GATEWAY_URL}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.WA_TOKEN}`
          },
          body: JSON.stringify({
            to: cleanPhone,
            msg: pesanWa
          })
        });

        const responseText = await waResponse.text();
        console.log('Respon Server WA (Status Update):', responseText);

        if (!waResponse.ok) {
          console.error(
            `[WA_ERROR] Gagal mengirim notifikasi status ke user. Status: ${waResponse.status}, Detail: ${responseText}`
          );
        }
      } catch (waError) {
        // Error jaringan WA hanya di-log agar response update database ke admin tetap sukses
        console.error('[WA_ERROR] Exception saat memanggil WA Gateway:', waError);
      }
    }

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