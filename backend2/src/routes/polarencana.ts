import { Hono } from 'hono';
import { db } from '../db';
import { polaRencana } from '../db/schema';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';

const app = new Hono();

// Helper untuk menentukan protokol (HTTPS / HTTP)
const getProtocol = (c: any) =>
  process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Helper Penyimpanan File Upload
const saveUploadedFile = async (file: File, folderName: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads', folderName);
  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const originalName = file.name || 'pola_rencana.pdf';
  const fileExt = path.extname(originalName) || '.pdf';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  return fileName;
};

// Helper Penghapusan File
const deleteFile = async (folderName: string, fileName: string) => {
  try {
    const filePath = path.join(process.cwd(), 'uploads', folderName, fileName);
    if (existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
};

// ==========================================
// RUTE PUBLIK (GET)
// ==========================================

// Get the first PolaRencana (ID = 1)
app.get('/', async (c) => {
  try {
    const [item] = await db
      .select()
      .from(polaRencana)
      .where(eq(polaRencana.id, 1));

    if (!item) {
      return c.json({ message: 'No Pola Rencana found' }, 404);
    }

    const protocol = getProtocol(c);
    const pdfUrl = item.pdf ? item.pdf.replace(/^https?:\/\//i, `${protocol}://`) : item.pdf;

    return c.json({
      data: {
        id: item.id,
        pdf: pdfUrl,
      },
    });
  } catch (error: any) {
    console.error('Error GET /pola-rencana:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE PROTEKSI AUTHENTICATION (PUT)
// ==========================================

// Update PolaRencana (ID = 1)
app.put('/', authentication, async (c) => {
  try {
    const [existing] = await db
      .select()
      .from(polaRencana)
      .where(eq(polaRencana.id, 1));

    if (!existing) {
      return c.json({ message: 'Pola Rencana not found' }, 404);
    }

    const formData = await c.req.parseBody();
    const file = formData['pdf'];

    let newPdfUrl = existing.pdf;

    if (file && typeof file !== 'string' && file instanceof File) {
      // Hapus file lama jika ada
      if (existing.pdf) {
        const oldFileName = path.basename(existing.pdf);
        await deleteFile('pola-rencana', oldFileName);
      }

      const filename = await saveUploadedFile(file, 'pola-rencana');
      const host = c.req.header('host') || 'localhost:3000';
      const protocol = getProtocol(c);

      // Membentuk URL publik lengkap menyertakan basePath
      newPdfUrl = `${protocol}://${host}/balai/bbwssumatera8/api/uploads/pola-rencana/${filename}`;
    }

    const [updated] = await db
      .update(polaRencana)
      .set({
        pdf: newPdfUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(polaRencana.id, 1))
      .returning();

    return c.json({
      data: {
        id: updated.id,
        pdf: updated.pdf,
      },
    });
  } catch (error: any) {
    console.error('Error PUT /pola-rencana:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;