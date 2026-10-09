import { Hono } from 'hono';
import { db } from '../db';
import { informasi } from '../db/schema';
import { eq, like, desc, asc, count } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';

const app = new Hono();

// Helper untuk penentuan protokol (HTTPS / HTTP)
const getProtocol = (c: any) =>
  process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Helper Penyimpanan File Upload
const saveUploadedFile = async (file: File, folderName: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads', folderName);
  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const originalName = file.name || 'informasi_file.pdf';
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

// 1. Read All Informasi (Pagination, Search, & Sorting)
app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;

    const searchQuery = (c.req.query('search') || '').toLowerCase();
    const sortParam = c.req.query('sort') || 'newest';
    const orderBy = sortParam === 'oldest' ? asc(informasi.createdAt) : desc(informasi.createdAt);

    const whereClause = searchQuery ? like(informasi.title, `%${searchQuery}%`) : undefined;

    // Hitung Total Data
    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(informasi)
      .where(whereClause);

    // Ambil Data
    const informasiList = await db
      .select()
      .from(informasi)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const protocol = getProtocol(c);
    const totalPages = Math.ceil(totalItems / limit);

    const formattedData = informasiList.map((info) => ({
      id: info.id,
      title: info.title,
      description: info.description,
      location: info.location,
      url: info.url ? info.url.replace(/^https?:\/\//i, `${protocol}://`) : null,
      createdAt: info.createdAt,
      updatedAt: info.updatedAt,
    }));

    return c.json({
      data: formattedData,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.error('Error GET /informasi:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 2. Read Informasi By ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [info] = await db.select().from(informasi).where(eq(informasi.id, id));

    if (!info) {
      return c.json({ message: 'Informasi not found' }, 404);
    }

    const protocol = getProtocol(c);
    const formattedData = {
      id: info.id,
      title: info.title,
      description: info.description,
      location: info.location,
      url: info.url ? info.url.replace(/^https?:\/\//i, `${protocol}://`) : null,
      createdAt: info.createdAt,
      updatedAt: info.updatedAt,
    };

    return c.json({ data: formattedData });
  } catch (error: any) {
    console.error('Error GET /informasi/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE PROTEKSI AUTHENTICATION (POST, PUT, DELETE)
// ==========================================

// 3. Create Informasi
app.post('/', authentication, async (c) => {
  try {
    const formData = await c.req.parseBody();
    const title = formData['title'] as string;
    const description = formData['description'] as string;
    const location = formData['location'] as string;
    const file = formData['file'];

    if (!title || !description) {
      return c.json({ message: 'Title and description are required' }, 400);
    }

    let fileUrl: string | null = null;

    if (file && typeof file !== 'string' && file instanceof File) {
      const filename = await saveUploadedFile(file, 'informasi');
      const host = c.req.header('host') || 'localhost:3000';
      const protocol = getProtocol(c);
      
      // Menggunakan path lengkap termasuk basePath agar file static menyatu
      fileUrl = `${protocol}://${host}/balai/bbwssumatera8/api/uploads/informasi/${filename}`;
    }

    const [inserted] = await db
      .insert(informasi)
      .values({
        title,
        description,
        location,
        url: fileUrl,
      })
      .returning();

    return c.json({ data: inserted }, 201);
  } catch (error: any) {
    console.error('Error POST /informasi:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 4. Update Informasi
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(informasi).where(eq(informasi.id, id));

    if (!existing) {
      return c.json({ message: 'Informasi not found' }, 404);
    }

    const formData = await c.req.parseBody();
    const title = (formData['title'] as string) || existing.title;
    const description = (formData['description'] as string) || existing.description;
    const location = (formData['location'] as string) || existing.location;
    const file = formData['file'];

    let newUrl = existing.url;

    if (file && typeof file !== 'string' && file instanceof File) {
      if (existing.url) {
        const oldFileName = path.basename(existing.url);
        await deleteFile('informasi', oldFileName);
      }

      const filename = await saveUploadedFile(file, 'informasi');
      const host = c.req.header('host') || 'localhost:3000';
      const protocol = getProtocol(c);
      
      newUrl = `${protocol}://${host}/balai/bbwssumatera8/api/uploads/informasi/${filename}`;
    }

    const [updated] = await db
      .update(informasi)
      .set({
        title,
        description,
        location,
        url: newUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(informasi.id, id))
      .returning();

    return c.json({ data: updated });
  } catch (error: any) {
    console.error('Error PUT /informasi/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 5. Delete Informasi
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(informasi).where(eq(informasi.id, id));

    if (!existing) {
      return c.json({ message: 'Informasi not found' }, 404);
    }

    if (existing.url) {
      const fileName = path.basename(existing.url);
      await deleteFile('informasi', fileName);
    }

    await db.delete(informasi).where(eq(informasi.id, id));

    return c.json({ message: 'Informasi deleted successfully' });
  } catch (error: any) {
    console.error('Error DELETE /informasi/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;