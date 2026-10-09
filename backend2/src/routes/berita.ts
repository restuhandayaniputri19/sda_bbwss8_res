import { Hono } from 'hono';
import { db } from '../db';
import { berita } from '../db/schema';
import { eq, like, or, desc, asc, count, and } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';
import { getPublicUploadUrl } from '../lib/public-url';

const app = new Hono();

// Helper untuk penentuan protokol
const getProtocol = (c: any) =>
  process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Helper Penyimpanan File Upload
const saveUploadedFile = async (file: File, folderName: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads', folderName);
  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const fileExt = path.extname(file.name) || '.jpg';
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
    console.error('Gagal menghapus file:', error);
  }
};

// ==========================================
// RUTE PUBLIK (READ / GET)
// ==========================================

// 1. Read All Berita (Pagination, Filter, Search)
app.get('/', async (c) => {
  try {
    // Sanitasi nilai page agar tidak pernah kurang dari 1
    const rawPage = parseInt(c.req.query('page') || '1', 10);
    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const rawLimit = parseInt(c.req.query('limit') || '10', 10);
    const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 10 : rawLimit;

    const offset = (page - 1) * limit;

    const sortParam = c.req.query('sort') === 'oldest' ? asc(berita.createdAt) : desc(berita.createdAt);
    const highlightedParam = c.req.query('highlighted');
    const searchQuery = c.req.query('search') || '';

    const conditions = [];

    if (highlightedParam === 'true') {
      conditions.push(eq(berita.highlighted, true));
    } else if (highlightedParam === 'false') {
      conditions.push(eq(berita.highlighted, false));
    }

    if (searchQuery) {
      conditions.push(
        or(
          like(berita.title, `%${searchQuery}%`),
          like(berita.description, `%${searchQuery}%`),
          like(berita.location, `%${searchQuery}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Hitung Total Data
    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(berita)
      .where(whereClause);

    // Ambil Baris Data
    const beritaList = await db
      .select()
      .from(berita)
      .where(whereClause)
      .orderBy(sortParam)
      .limit(limit)
      .offset(offset);

    const protocol = getProtocol(c);
    const totalPages = Math.ceil(totalItems / limit);

    const formattedData = beritaList.map((item) => ({
      ...item,
      img: item.img ? item.img.replace(/^https?:\/\//, `${protocol}://`) : null,
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
    console.error('Error GET /berita:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 2. Read All Highlighted Berita
app.get('/highlighted', async (c) => {
  try {
    const highlightedList = await db
      .select()
      .from(berita)
      .where(eq(berita.highlighted, true))
      .orderBy(desc(berita.createdAt));

    if (highlightedList.length === 0) {
      return c.json({ message: 'No highlighted berita found' }, 404);
    }

    const protocol = getProtocol(c);
    const formattedData = highlightedList.map((item) => ({
      ...item,
      img: item.img ? item.img.replace(/^https?:\/\//, `${protocol}://`) : null,
    }));

    return c.json({ data: formattedData });
  } catch (error: any) {
    console.error('Error GET /berita/highlighted:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 3. Read Berita By ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID format' }, 400);
    }

    const [item] = await db.select().from(berita).where(eq(berita.id, id));

    if (!item) {
      return c.json({ message: 'Berita not found' }, 404);
    }

    const protocol = getProtocol(c);
    item.img = item.img ? item.img.replace(/^https?:\/\//, `${protocol}://`) : null;

    return c.json({ data: item });
  } catch (error: any) {
    console.error(`Error GET /berita/${c.req.param('id')}:`, error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE TERPROTEKSI AUTHENTICATION (WRITE / MUTATION)
// ==========================================

// 4. Create Berita
app.post('/', authentication, async (c) => {
  try {
    const formData = await c.req.parseBody();

    const title = (formData['title'] as string) || '';
    const description = (formData['description'] as string) || '';
    const location = (formData['location'] as string) || '';
    const highlighted = formData['highlighted'] === 'true' || formData['highlighted'] === '1';

    // Mendukung key 'img', 'file', atau 'image' dari FormData frontend
    const file = (formData['img'] || formData['file'] || formData['image']) as File;

    if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') {
      return c.json({ message: 'Image file is required and must be a valid file' }, 400);
    }

    const filename = await saveUploadedFile(file, 'berita');
    const imgUrl = getPublicUploadUrl(c.req.url, 'berita', filename);

    const [inserted] = await db
      .insert(berita)
      .values({
        title,
        description,
        location,
        img: imgUrl,
        highlighted,
      })
      .returning();

    return c.json({ data: inserted }, 201);
  } catch (error: any) {
    console.error('Error POST /berita:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 5. Update Berita
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID format' }, 400);
    }

    const [existing] = await db.select().from(berita).where(eq(berita.id, id));

    if (!existing) {
      return c.json({ message: 'Berita not found' }, 404);
    }

    const formData = await c.req.parseBody();
    const title = (formData['title'] as string) || existing.title;
    const description = (formData['description'] as string) || existing.description;
    const location = (formData['location'] as string) || existing.location;
    const highlighted =
      formData['highlighted'] !== undefined
        ? formData['highlighted'] === 'true' || formData['highlighted'] === '1'
        : existing.highlighted;

    const file = (formData['img'] || formData['file'] || formData['image']) as File;

    let imgUrl = existing.img;

    if (file && typeof file !== 'string' && typeof file.arrayBuffer === 'function') {
      if (existing.img) {
        const oldFileName = path.basename(existing.img);
        await deleteFile('berita', oldFileName);
      }
      const filename = await saveUploadedFile(file, 'berita');
      imgUrl = getPublicUploadUrl(c.req.url, 'berita', filename);
    }

    const [updated] = await db
      .update(berita)
      .set({
        title,
        description,
        location,
        highlighted,
        img: imgUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(berita.id, id))
      .returning();

    return c.json({ data: updated });
  } catch (error: any) {
    console.error(`Error PUT /berita/${c.req.param('id')}:`, error);
    return c.json({ error: error.message }, 500);
  }
});

// 6. Delete Berita
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID format' }, 400);
    }

    const [existing] = await db.select().from(berita).where(eq(berita.id, id));

    if (!existing) {
      return c.json({ message: 'Berita not found' }, 404);
    }

    if (existing.img) {
      const imgFileName = path.basename(existing.img);
      await deleteFile('berita', imgFileName);
    }

    await db.delete(berita).where(eq(berita.id, id));

    return c.json({ message: 'Berita deleted successfully' });
  } catch (error: any) {
    console.error(`Error DELETE /berita/${c.req.param('id')}:`, error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;