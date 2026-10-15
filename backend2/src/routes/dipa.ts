import { Hono } from 'hono';
import { db } from '../db';
import { dipa } from '../db/schema';
import { eq, like, desc, asc, count } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';
import { API_BASE_PATH } from '../lib/public-url';

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

  const originalName = file.name || 'dipa_file.pdf';
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

// 1. Read All Dipa (Pagination, Search, & Sorting)
app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;

    const searchQuery = (c.req.query('search') || '').toLowerCase();
    const sortParam = c.req.query('sort') || 'newest';
    const orderBy = sortParam === 'oldest' ? asc(dipa.createdAt) : desc(dipa.createdAt);

    const whereClause = searchQuery ? like(dipa.title, `%${searchQuery}%`) : undefined;

    // Hitung Total Data
    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(dipa)
      .where(whereClause);

    // Ambil Data
    const dipaList = await db
      .select()
      .from(dipa)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const protocol = getProtocol(c);
    const totalPages = Math.ceil(totalItems / limit);

    const formattedData = dipaList.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url ? item.url.replace(/^https?:\/\//i, `${protocol}://`) : null,
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
    console.error('Error GET /dipa:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 2. Read Dipa By ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [item] = await db.select().from(dipa).where(eq(dipa.id, id));

    if (!item) {
      return c.json({ message: 'Dipa not found' }, 404);
    }

    const protocol = getProtocol(c);
    const formattedData = {
      id: item.id,
      title: item.title,
      url: item.url ? item.url.replace(/^https?:\/\//i, `${protocol}://`) : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    return c.json({ data: formattedData });
  } catch (error: any) {
    console.error('Error GET /dipa/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE PROTEKSI AUTHENTICATION (POST, PUT, DELETE)
// ==========================================

// 3. Create Dipa
app.post('/', authentication, async (c) => {
  try {
    const formData = await c.req.parseBody();
    const title = formData['title'] as string;
    const file = formData['dipa']; // membaca field 'dipa'

    if (!title) {
      return c.json({ message: 'Title is required' }, 400);
    }

    if (!file || typeof file === 'string' || !(file instanceof File)) {
      return c.json({ message: 'Dipa file is required' }, 400);
    }

    const filename = await saveUploadedFile(file, 'dipa');
    const host = c.req.header('host') || 'localhost:3000';
    const protocol = getProtocol(c);

    // Membentuk URL publik lengkap menyertakan API_BASE_PATH
    const fileUrl = `${protocol}://${host}${API_BASE_PATH}/uploads/dipa/${filename}`;

    const [inserted] = await db
      .insert(dipa)
      .values({
        title,
        url: fileUrl,
      })
      .returning();

    return c.json(
      {
        data: {
          id: inserted.id,
          title: inserted.title,
          url: inserted.url,
          createdAt: inserted.createdAt,
          updatedAt: inserted.updatedAt,
        },
      },
      201
    );
  } catch (error: any) {
    console.error('Error POST /dipa:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 4. Update Dipa
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(dipa).where(eq(dipa.id, id));

    if (!existing) {
      return c.json({ message: 'Dipa not found' }, 404);
    }

    const formData = await c.req.parseBody();
    const title = (formData['title'] as string) || existing.title;
    const file = formData['dipa'];

    let newUrl = existing.url;

    if (file && typeof file !== 'string' && file instanceof File) {
      if (existing.url) {
        const oldFileName = path.basename(existing.url);
        await deleteFile('dipa', oldFileName);
      }

      const filename = await saveUploadedFile(file, 'dipa');
      const host = c.req.header('host') || 'localhost:3000';
      const protocol = getProtocol(c);

      newUrl = `${protocol}://${host}${API_BASE_PATH}/uploads/dipa/${filename}`;
    }

    const [updated] = await db
      .update(dipa)
      .set({
        title,
        url: newUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dipa.id, id))
      .returning();

    return c.json({
      data: {
        id: updated.id,
        title: updated.title,
        url: updated.url,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error PUT /dipa/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 5. Delete Dipa
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(dipa).where(eq(dipa.id, id));

    if (!existing) {
      return c.json({ message: 'Dipa not found' }, 404);
    }

    if (existing.url) {
      const fileName = path.basename(existing.url);
      await deleteFile('dipa', fileName);
    }

    await db.delete(dipa).where(eq(dipa.id, id));

    return c.json({ message: 'Dipa deleted successfully' });
  } catch (error: any) {
    console.error('Error DELETE /dipa/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;