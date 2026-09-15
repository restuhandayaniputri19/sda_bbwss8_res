import { Hono } from 'hono';
import { db } from '../db';
import { berita } from '../db/schema';
import { eq, like, or, desc, asc, count, and } from 'drizzle-orm';
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
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
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
    return c.json({ error: error.message }, 500);
  }
});

// 3. Read Berita By ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [item] = await db.select().from(berita).where(eq(berita.id, id));

    if (!item) {
      return c.json({ message: 'Berita not found' }, 404);
    }

    const protocol = getProtocol(c);
    item.img = item.img ? item.img.replace(/^https?:\/\//, `${protocol}://`) : null;

    return c.json({ data: item });
  } catch (error: any) {
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
    const title = formData['title'] as string;
    const description = formData['description'] as string;
    const location = formData['location'] as string;
    const highlighted = formData['highlighted'] === 'true' || formData['highlighted'] === '1';
    const file = formData['img'] as File;

    if (!file || typeof file === 'string') {
      return c.json({ message: 'Image file is required' }, 400);
    }

    const filename = await saveUploadedFile(file, 'berita');
    const host = c.req.header('host') || 'localhost:3000';
    const protocol = getProtocol(c);
    const imgUrl = `${protocol}://${host}/uploads/berita/${filename}`;

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
    return c.json({ error: error.message }, 500);
  }
});

// 5. Update Berita
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
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
    const file = formData['img'] as File;

    let imgUrl = existing.img;

    if (file && typeof file !== 'string') {
      if (existing.img) {
        const oldFileName = path.basename(existing.img);
        await deleteFile('berita', oldFileName);
      }
      const filename = await saveUploadedFile(file, 'berita');
      const host = c.req.header('host') || 'localhost:3000';
      const protocol = getProtocol(c);
      imgUrl = `${protocol}://${host}/uploads/berita/${filename}`;
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
    return c.json({ error: error.message }, 500);
  }
});

// 6. Delete Berita
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
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
    return c.json({ error: error.message }, 500);
  }
});

export default app;