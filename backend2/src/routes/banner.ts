import { Hono } from 'hono';
import { db } from '../db';
import { banners } from '../db/schema';
import { eq, desc, asc, count } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';
import { getPublicUploadUrl } from '../lib/public-url';

const app = new Hono();

// Helper Protocol (HTTP / HTTPS)
const getProtocol = (c: any) =>
  process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Helper Save Uploaded File
const saveUploadedFile = async (file: File, folderName: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads', folderName);
  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const originalName = file.name || 'banner.png';
  const fileExt = path.extname(originalName) || '.png';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  return fileName;
};

// Helper Delete File
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

// 1. Get all Banners with Pagination and Sorting
app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;

    const sortParam = c.req.query('sort') || 'newest';
    const orderBy = sortParam === 'oldest' ? asc(banners.createdAt) : desc(banners.createdAt);

    // Total Count
    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(banners);

    // Fetch Rows
    const bannerList = await db
      .select()
      .from(banners)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const protocol = getProtocol(c);
    const totalPages = Math.ceil(totalItems / limit);

    const formattedData = bannerList.map((banner) => ({
      id: banner.id,
      url: banner.url ? banner.url.replace(/^https?:\/\//i, `${protocol}://`) : '',
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
    console.error('Error GET /banners:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE PROTEKSI AUTHENTICATION (POST, DELETE)
// ==========================================

// 2. Upload Banners (Multiple File Upload)
app.post('/upload', authentication, async (c) => {
  try {
    const formData = await c.req.parseBody({ all: true });
    let filesInput = formData['banners'];

    if (!filesInput) {
      return c.json({ message: 'No files uploaded' }, 400);
    }

    // Normalisasi input menjadi array jika hanya 1 file yang diunggah
    let files: File[] = [];
    if (Array.isArray(filesInput)) {
      files = filesInput.filter((f): f is File => f instanceof File);
    } else if (filesInput instanceof File) {
      files = [filesInput];
    }

    if (files.length === 0) {
      return c.json({ message: 'No files uploaded' }, 400);
    }

    // Batasi maksimum 3 file sesuai middleware bawaan
    if (files.length > 3) {
      return c.json({ message: 'Maximum 3 files allowed' }, 400);
    }

    const host = c.req.header('host') || 'localhost:3000';
    const protocol = getProtocol(c);

    const savedFiles = await Promise.all(
      files.map(async (file) => {
        const filename = await saveUploadedFile(file, 'banners');
        const fileUrl = getPublicUploadUrl(c.req.url, 'banners', filename);

        const [inserted] = await db
          .insert(banners)
          .values({
            url: fileUrl,
            filename: filename,
          })
          .returning();

        return {
          id: inserted.id,
          url: inserted.url,
        };
      })
    );

    return c.json({ data: savedFiles }, 200);
  } catch (error: any) {
    console.error('Error POST /banners/upload:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 3. Delete a specific Banner by ID
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(banners).where(eq(banners.id, id));

    if (!existing) {
      return c.json({ message: 'Banner not found' }, 404);
    }

    if (existing.filename) {
      await deleteFile('banners', existing.filename);
    }

    await db.delete(banners).where(eq(banners.id, id));

    return c.json({ message: 'Banner deleted successfully' });
  } catch (error: any) {
    console.error('Error DELETE /banners/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;