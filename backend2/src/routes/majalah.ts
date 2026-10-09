import { Hono } from 'hono';
import { db } from '../db';
import { majalah } from '../db/schema';
import { eq, like, desc, asc, count } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';

const app = new Hono();

// Helper untuk menentukan protokol (HTTPS / HTTP)
const getProtocol = (c: any) =>
  process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Helper Penyimpanan File Upload
const saveUploadedFile = async (file: File, folderName: string, defaultExt: string = '.pdf'): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads', folderName);
  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const originalName = file.name || `file${defaultExt}`;
  const fileExt = path.extname(originalName) || defaultExt;
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

// 1. Read All Majalah (Pagination, Search, & Sorting)
app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;

    const searchQuery = (c.req.query('search') || '').toLowerCase();
    const sortParam = c.req.query('sort') || 'newest';
    const orderBy = sortParam === 'oldest' ? asc(majalah.createdAt) : desc(majalah.createdAt);

    const whereClause = searchQuery ? like(majalah.title, `%${searchQuery}%`) : undefined;

    // Hitung Total Data
    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(majalah)
      .where(whereClause);

    // Ambil Data
    const majalahList = await db
      .select()
      .from(majalah)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const protocol = getProtocol(c);
    const totalPages = Math.ceil(totalItems / limit);

    const formattedData = majalahList.map((item) => ({
      id: item.id,
      thumbnail: item.thumbnail ? item.thumbnail.replace(/^https?:\/\//i, `${protocol}://`) : item.thumbnail,
      title: item.title,
      url: item.url ? item.url.replace(/^https?:\/\//i, `${protocol}://`) : item.url,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
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
    console.error('Error GET /majalah:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 2. Read Majalah By ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [item] = await db.select().from(majalah).where(eq(majalah.id, id));

    if (!item) {
      return c.json({ message: 'Majalah not found' }, 404);
    }

    const protocol = getProtocol(c);
    const formattedData = {
      id: item.id,
      thumbnail: item.thumbnail ? item.thumbnail.replace(/^https?:\/\//i, `${protocol}://`) : item.thumbnail,
      title: item.title,
      url: item.url ? item.url.replace(/^https?:\/\//i, `${protocol}://`) : item.url,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    return c.json({ data: formattedData });
  } catch (error: any) {
    console.error('Error GET /majalah/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE PROTEKSI AUTHENTICATION (POST, PUT, DELETE)
// ==========================================

// 3. Create Majalah
app.post('/', authentication, async (c) => {
  try {
    const formData = await c.req.parseBody();
    const title = formData['title'] as string;
    const thumbnailFile = formData['thumbnail'];
    const majalahFile = formData['majalah'];

    if (!thumbnailFile || !(thumbnailFile instanceof File) || !majalahFile || !(majalahFile instanceof File)) {
      return c.json({ message: 'Both thumbnail and majalah are required' }, 400);
    }

    const thumbnailFilename = await saveUploadedFile(thumbnailFile, 'majalah', '.png');
    const majalahFilename = await saveUploadedFile(majalahFile, 'majalah', '.pdf');

    const host = c.req.header('host') || 'localhost:3000';
    const protocol = getProtocol(c);

    // Menyusun URL publik lengkap menyertakan basePath
    const thumbnailUrl = `${protocol}://${host}/balai/bbwssumatera8/api/uploads/majalah/${thumbnailFilename}`;
    const majalahUrl = `${protocol}://${host}/balai/bbwssumatera8/api/uploads/majalah/${majalahFilename}`;

    const [inserted] = await db
      .insert(majalah)
      .values({
        title,
        thumbnail: thumbnailUrl,
        url: majalahUrl,
      })
      .returning();

    return c.json({ data: inserted }, 201);
  } catch (error: any) {
    console.error('Error POST /majalah:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 4. Update Majalah
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(majalah).where(eq(majalah.id, id));

    if (!existing) {
      return c.json({ message: 'Majalah not found' }, 404);
    }

    const formData = await c.req.parseBody();
    const title = (formData['title'] as string) || existing.title;
    const thumbnailFile = formData['thumbnail'];
    const majalahFile = formData['majalah'];

    const host = c.req.header('host') || 'localhost:3000';
    const protocol = getProtocol(c);

    let newThumbnailUrl = existing.thumbnail;
    let newMajalahUrl = existing.url;

    // Jika file thumbnail baru diunggah
    if (thumbnailFile && typeof thumbnailFile !== 'string' && thumbnailFile instanceof File) {
      if (existing.thumbnail) {
        const oldThumbnailFileName = path.basename(existing.thumbnail);
        await deleteFile('majalah', oldThumbnailFileName);
      }
      const thumbnailFilename = await saveUploadedFile(thumbnailFile, 'majalah', '.png');
      newThumbnailUrl = `${protocol}://${host}/balai/bbwssumatera8/api/uploads/majalah/${thumbnailFilename}`;
    }

    // Jika file majalah baru diunggah
    if (majalahFile && typeof majalahFile !== 'string' && majalahFile instanceof File) {
      if (existing.url) {
        const oldMajalahFileName = path.basename(existing.url);
        await deleteFile('majalah', oldMajalahFileName);
      }
      const majalahFilename = await saveUploadedFile(majalahFile, 'majalah', '.pdf');
      newMajalahUrl = `${protocol}://${host}/balai/bbwssumatera8/api/uploads/majalah/${majalahFilename}`;
    }

    const [updated] = await db
      .update(majalah)
      .set({
        title,
        thumbnail: newThumbnailUrl,
        url: newMajalahUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(majalah.id, id))
      .returning();

    return c.json({ data: updated });
  } catch (error: any) {
    console.error('Error PUT /majalah/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 5. Delete Majalah
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(majalah).where(eq(majalah.id, id));

    if (!existing) {
      return c.json({ message: 'Majalah not found' }, 404);
    }

    if (existing.thumbnail) {
      const thumbnailFileName = path.basename(existing.thumbnail);
      await deleteFile('majalah', thumbnailFileName);
    }

    if (existing.url) {
      const majalahFileName = path.basename(existing.url);
      await deleteFile('majalah', majalahFileName);
    }

    await db.delete(majalah).where(eq(majalah.id, id));

    return c.json({ message: 'Majalah deleted successfully' });
  } catch (error: any) {
    console.error('Error DELETE /majalah/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;