import { Hono } from 'hono';
import { db } from '../db';
import { permintaanData } from '../db/schema';
import { eq, desc, and, type SQL } from 'drizzle-orm';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const app = new Hono();

const VALID_STATUSES = ['pending', 'diproses', 'selesai', 'ditolak'] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

const getUploadedFile = (value: unknown): File | null =>
  value && typeof value !== 'string' && value instanceof File && value.size > 0
    ? value
    : null;

const validateAttachment = (file: File, label: string) => {
  const fileExt = path.extname(file.name).toLowerCase();
  if (
    file.size > MAX_ATTACHMENT_SIZE ||
    !ALLOWED_MIME_TYPES.includes(file.type) ||
    !ALLOWED_EXTENSIONS.includes(fileExt)
  ) {
    return `${label}: unggah PDF, JPG, JPEG, atau PNG dengan ukuran maksimal 5 MB.`;
  }
  return null;
};

const saveAttachment = async (file: File, label: string) => {
  const uploadDir = path.resolve(process.cwd(), 'uploads', 'surat');
  await mkdir(uploadDir, { recursive: true });

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${Date.now()}-${label}-${cleanFileName}`;
  const fullPath = path.join(uploadDir, fileName);
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(fullPath, Buffer.from(arrayBuffer));

  return `/uploads/surat/${fileName}`;
};

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
    const namaLengkap = typeof body.namaLengkap === 'string' ? body.namaLengkap.trim() : '';
    const instansi = typeof body.instansi === 'string' ? body.instansi.trim() : '';
    const jenisData = typeof body.jenisData === 'string' ? body.jenisData.trim() : '';
    const periodeDari = typeof body.periodeDari === 'string' ? body.periodeDari.trim() : '';
    const periodeSampai = typeof body.periodeSampai === 'string' ? body.periodeSampai.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const noWaValue = body.noWa ?? body.noTelepon;
    const noWa = typeof noWaValue === 'string' ? noWaValue.trim() : '';
    const tujuanPenggunaan = typeof body.tujuanPenggunaan === 'string' ? body.tujuanPenggunaan.trim() : '';

    if (!namaLengkap || !noWa || !jenisData || !periodeDari || !periodeSampai || !email || !tujuanPenggunaan) {
      return c.json({
        success: false,
        message: 'Nama, telepon, email, jenis data, periode, dan tujuan penggunaan wajib diisi.'
      }, 400);
    }

    const fileSurat = getUploadedFile(body.fileSurat || body.file);
    const fileIdentitas = getUploadedFile(body.fileIdentitas);
    const fileTambahan = getUploadedFile(body.fileTambahan);

    if (!fileSurat) {
      return c.json({ success: false, message: 'Surat permintaan wajib diunggah.' }, 400);
    }
    if (!fileIdentitas) {
      return c.json({ success: false, message: 'Identitas diri (KTP atau Kartu Mahasiswa) wajib diunggah.' }, 400);
    }

    const attachmentErrors = [
      validateAttachment(fileSurat, 'Surat permintaan'),
      validateAttachment(fileIdentitas, 'Identitas diri'),
      fileTambahan ? validateAttachment(fileTambahan, 'Dokumen tambahan') : null,
    ].filter(Boolean);
    if (attachmentErrors.length > 0) {
      return c.json({ success: false, message: attachmentErrors[0] }, 400);
    }

    const [fileSuratPath, fileIdentitasPath, fileTambahanPath] = await Promise.all([
      saveAttachment(fileSurat, 'surat-permintaan'),
      saveAttachment(fileIdentitas, 'identitas'),
      fileTambahan ? saveAttachment(fileTambahan, 'tambahan') : Promise.resolve(null),
    ]);

    const result = await db.insert(permintaanData).values({
      namaLengkap,
      instansi: instansi || null,
      jenisData,
      periodeDari,
      periodeSampai,
      email,
      noWa,
      tujuanPenggunaan,
      fileSurat: fileSuratPath,
      fileIdentitas: fileIdentitasPath,
      fileTambahan: fileTambahanPath,
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
