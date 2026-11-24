import { Hono } from 'hono';
import { db } from '../db';
import { layananTerpadu } from '../db/schema';
import { eq, like, desc, asc, count, and } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';
import { getPublicUploadUrl } from '../lib/public-url';

const app = new Hono();
const supportedPlatforms = ['internal', 'external', 'android', 'ios', 'deeplink', 'download'];

const parseBoolean = (value: unknown, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value === true || value === 'true' || value === '1';
};

// Helper penentuan protokol (HTTPS / HTTP)
const getProtocol = (c: any) =>
  process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Helper Penyimpanan File Upload Gambar
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

const deleteUploadedLayananImage = async (imageValue: string | null) => {
  if (!imageValue) return;

  try {
    const imagePath = new URL(imageValue).pathname;
    if (!imagePath.includes('/uploads/layanan-terpadu/')) return;
    await deleteFile('layanan-terpadu', path.basename(imagePath));
  } catch {
    // Icon names and non-URL values are stored in img too; they are not files.
  }
};

// ==========================================
// RUTE PUBLIK (READ / GET)
// ==========================================

// 1. Read All Layanan Terpadu (Pagination, Search, & Sorting)
app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = parseInt(c.req.query('limit') || '10', 10);
    const offset = (page - 1) * limit;

    const searchQuery = (c.req.query('search') || '').toLowerCase();
    const publicOnly = c.req.query('publicOnly') === 'true';
    const sortParam = c.req.query('sort') || 'newest';
    const orderBy = publicOnly || sortParam === 'displayOrder'
      ? [asc(layananTerpadu.displayOrder), asc(layananTerpadu.id)]
      : [sortParam === 'oldest' ? asc(layananTerpadu.createdAt) : desc(layananTerpadu.createdAt)];

    const filters = [];
    if (searchQuery) filters.push(like(layananTerpadu.title, `%${searchQuery}%`));
    if (publicOnly) filters.push(eq(layananTerpadu.isVisible, true));
    const whereClause = filters.length ? and(...filters) : undefined;

    // Hitung Total Data
    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(layananTerpadu)
      .where(whereClause);

    // Ambil Data
    const layananList = await db
      .select()
      .from(layananTerpadu)
      .where(whereClause)
      .orderBy(...orderBy)
      .limit(limit)
      .offset(offset);

    const protocol = getProtocol(c);
    const totalPages = Math.ceil(totalItems / limit);

    const formattedData = layananList.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      platform: item.platform,
      description: item.description,
      img: item.img ? item.img.replace(/^https?:\/\//i, `${protocol}://`) : null,
      isVisible: item.isVisible,
      isClickable: item.isClickable,
      displayOrder: item.displayOrder,
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
    console.error('Error GET /layanan-terpadu:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 2. Read Layanan Terpadu By ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ message: 'Invalid ID format' }, 400);

    const [item] = await db
      .select()
      .from(layananTerpadu)
      .where(eq(layananTerpadu.id, id));

    if (!item) {
      return c.json({ message: 'Layanan not found' }, 404);
    }

    const protocol = getProtocol(c);

    return c.json({
      data: {
        id: item.id,
        title: item.title,
        url: item.url,
        platform: item.platform,
        description: item.description,
        img: item.img ? item.img.replace(/^https?:\/\//i, `${protocol}://`) : null,
        isVisible: item.isVisible,
        isClickable: item.isClickable,
        displayOrder: item.displayOrder,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error GET /layanan-terpadu/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE PROTEKSI AUTHENTICATION (POST, PUT, DELETE)
// ==========================================

// 3. Create Layanan Terpadu
app.post('/', authentication, async (c) => {
  try {
    const formData = await c.req.parseBody({ all: true });

    const title = (formData['title'] as string)?.trim();
    const url = (formData['url'] as string)?.trim();
    const platform = (formData['platform'] as string)?.trim();
    const description = (formData['description'] as string)?.trim();
    const isVisible = parseBoolean(formData['isVisible'], true);
    const isClickable = parseBoolean(formData['isClickable'], true);
    const displayOrderRaw = Number(formData['displayOrder'] ?? 0);
    const displayOrder = Number.isInteger(displayOrderRaw) ? displayOrderRaw : 0;

    const file = (formData['img'] || formData['file'] || formData['image']) as File;
    const iconName = (formData['imgIcon'] as string | undefined)?.trim();

    if (!title || !url || !platform || !description) {
      return c.json({ message: 'Title, URL, platform, and description are required' }, 400);
    }
    if (!supportedPlatforms.includes(platform)) {
      return c.json({ message: 'Unsupported platform' }, 400);
    }

    let imageValue: string | null = iconName || null;

    if (file && typeof file !== 'string' && file instanceof File && file.size > 0) {
      const filename = await saveUploadedFile(file, 'layanan-terpadu');
      imageValue = getPublicUploadUrl(c.req.url, 'layanan-terpadu', filename);
    }

    const [inserted] = await db
      .insert(layananTerpadu)
      .values({
        title,
        url,
        platform,
        description,
        img: imageValue,
        isVisible,
        isClickable,
        displayOrder,
      })
      .returning();

    return c.json({ data: inserted }, 201);
  } catch (error: any) {
    console.error('Error POST /layanan-terpadu:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 4. Update Layanan Terpadu
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ message: 'Invalid ID format' }, 400);

    const [existing] = await db
      .select()
      .from(layananTerpadu)
      .where(eq(layananTerpadu.id, id));

    if (!existing) {
      return c.json({ message: 'Layanan not found' }, 404);
    }

    const formData = await c.req.parseBody({ all: true });

    const title = (formData['title'] as string)?.trim() || existing.title;
    const url = (formData['url'] as string)?.trim() || existing.url;
    const platform = (formData['platform'] as string)?.trim() || existing.platform;
    const description = (formData['description'] as string)?.trim() || existing.description;
    const isVisible = parseBoolean(formData['isVisible'], existing.isVisible);
    const isClickable = parseBoolean(formData['isClickable'], existing.isClickable);
    const displayOrderRaw = formData['displayOrder'] === undefined
      ? existing.displayOrder
      : Number(formData['displayOrder']);
    const displayOrder = Number.isInteger(displayOrderRaw) ? displayOrderRaw : existing.displayOrder;

    const file = (formData['img'] || formData['file'] || formData['image']) as File;
    const iconName = (formData['imgIcon'] as string | undefined)?.trim();
    const clearImage = parseBoolean(formData['clearImg'], false);

    if (!supportedPlatforms.includes(platform)) {
      return c.json({ message: 'Unsupported platform' }, 400);
    }

    let newImageUrl = existing.img;

    if (clearImage || iconName) {
      await deleteUploadedLayananImage(existing.img);
      newImageUrl = clearImage ? null : iconName;
    } else if (file && typeof file !== 'string' && file instanceof File && file.size > 0) {
      await deleteUploadedLayananImage(existing.img);
      const filename = await saveUploadedFile(file, 'layanan-terpadu');
      newImageUrl = getPublicUploadUrl(c.req.url, 'layanan-terpadu', filename);
    }

    const [updated] = await db
      .update(layananTerpadu)
      .set({
        title,
        url,
        platform,
        description,
        img: newImageUrl,
        isVisible,
        isClickable,
        displayOrder,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(layananTerpadu.id, id))
      .returning();

    return c.json({ data: updated });
  } catch (error: any) {
    console.error(`Error PUT /layanan-terpadu/${c.req.param('id')}:`, error);
    return c.json({ error: error.message }, 500);
  }
});

// 5. Delete Layanan Terpadu
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ message: 'Invalid ID format' }, 400);

    const [existing] = await db
      .select()
      .from(layananTerpadu)
      .where(eq(layananTerpadu.id, id));

    if (!existing) {
      return c.json({ message: 'Layanan not found' }, 404);
    }

    await deleteUploadedLayananImage(existing.img);

    await db.delete(layananTerpadu).where(eq(layananTerpadu.id, id));

    return c.json({ message: 'Layanan deleted successfully' });
  } catch (error: any) {
    console.error(`Error DELETE /layanan-terpadu/${c.req.param('id')}:`, error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
