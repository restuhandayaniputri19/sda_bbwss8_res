import { Hono } from 'hono';
import { db } from '../db';
import { infografis, Category } from '../db/schema';
import { and, eq, gte, lt } from 'drizzle-orm';
import { authentication } from '../middleware/authentication';
import { join } from 'node:path';
import { deleteUploadedImage, saveOptimizedWebp } from '../lib/image';
import { createAdminLog } from '../utils/logger';

const uploadDir = join(process.cwd(), 'uploads', 'infografis');

const route = new Hono();

// Helper ekstrak IP Address
const getIp = (c: any) =>
  c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
  c.req.header('x-real-ip') ||
  '127.0.0.1';

// 1. Ambil Semua Data Infografis
route.get('/', async (c) => {
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 10;
  const offset = (page - 1) * limit;

  const categoryFilter = c.req.query('category');
  const monthFilter = c.req.query('month');
  const isValidMonth = monthFilter && /^\d{4}-(0[1-9]|1[0-2])$/.test(monthFilter);
  const monthStart = isValidMonth ? new Date(`${monthFilter}-01T00:00:00.000Z`) : undefined;
  const monthEnd = monthStart
    ? new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1))
    : undefined;

  const whereCondition = and(
    categoryFilter ? eq(infografis.category, categoryFilter as Category) : undefined,
    monthStart && monthEnd
      ? and(gte(infografis.createdAt, monthStart), lt(infografis.createdAt, monthEnd))
      : undefined
  );

  const list = await db
    .select()
    .from(infografis)
    .where(whereCondition)
    .limit(limit)
    .offset(offset)
    .all();

  const allData = await db.select().from(infografis).where(whereCondition).all();
  const count = allData.length;
  const totalPages = Math.ceil(count / limit);

  const urlObj = new URL(c.req.url);
  const protocol = urlObj.protocol.replace(':', '');

  return c.json(
    {
      data: list.map((item) => ({
        id: item.id,
        url: item.url.replace(/^https?:\/\//, `${protocol}://`),
        description: item.description,
        category: item.category,
        createdAt: item.createdAt,
        updatedAt: item.createdAt,
      })),
      meta: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    },
    200
  );
});

// 2. Ambil Infografis Berdasarkan ID
route.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ message: 'ID tidak valid' }, 400);

  const [item] = await db
    .select()
    .from(infografis)
    .where(eq(infografis.id, id))
    .all();

  if (!item) return c.json({ message: 'Data tidak ditemukan' }, 404);
  return c.json(item);
});

// 3. Create Infografis (POST)
route.post('/upload', authentication, async (c) => {
  const body = await c.req.parseBody();
  const file = body.infografis as File;

  if (!file || !(file instanceof File)) {
    return c.json({ message: 'File tidak ditemukan' }, 400);
  }

  let fileName: string;
  try {
    fileName = await saveOptimizedWebp(file, uploadDir);
  } catch (error) {
    return c.json({ message: error instanceof Error ? error.message : 'Gagal memproses gambar' }, 400);
  }

  const urlObj = new URL(c.req.url);
  const protocol = urlObj.protocol;
  const host = urlObj.host;

  const currentRoutePath = '/infografis/upload';
  const basePath = c.req.path.split(currentRoutePath)[0];

  const generatedUrl = `${protocol}//${host}${basePath}/uploads/infografis/${fileName}`;

  const newItem = await db
    .insert(infografis)
    .values({
      url: generatedUrl,
      description: body.description as string,
      category: body.category as Category,
    })
    .returning();

  const user = c.get('user');

  await createAdminLog({
    userId: user?.id,
    username: user?.username,
    action: 'CREATE_INFOGRAFIS',
    targetEntity: 'infografis',
    targetId: String(newItem[0].id),
    details: {
      category: newItem[0].category,
      description: newItem[0].description,
    },
    ipAddress: getIp(c),
  });

  return c.json(newItem[0], 201);
});

// 4. Update Infografis (PUT)
route.put('/:id', authentication, async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ message: 'ID tidak valid' }, 400);

  const body = await c.req.parseBody();
  const file = body.infografis as File;

  const [existingItem] = await db
    .select()
    .from(infografis)
    .where(eq(infografis.id, id))
    .all();

  if (!existingItem) return c.json({ message: 'Data tidak ditemukan' }, 404);

  let imageUrl = existingItem.url;
  if (file instanceof File) {
    let fileName: string;
    try {
      fileName = await saveOptimizedWebp(file, uploadDir);
    } catch (error) {
      return c.json({ message: error instanceof Error ? error.message : 'Gagal memproses gambar' }, 400);
    }

    const urlObj = new URL(c.req.url);
    const basePath = c.req.path.split(`/infografis/${id}`)[0];
    imageUrl = `${urlObj.protocol}//${urlObj.host}${basePath}/uploads/infografis/${fileName}`;
  }

  const updatedItem = await db
    .update(infografis)
    .set({
      url: imageUrl,
      description: body.description as string,
      category: body.category as Category,
    })
    .where(eq(infografis.id, id))
    .returning();

  if (updatedItem.length === 0) return c.json({ message: 'Gagal update' }, 404);

  const user = c.get('user');

  await createAdminLog({
    userId: user?.id,
    username: user?.username,
    action: 'UPDATE_INFOGRAFIS',
    targetEntity: 'infografis',
    targetId: String(updatedItem[0].id),
    details: {
      old: {
        description: existingItem.description,
        category: existingItem.category,
        url: existingItem.url,
      },
      new: {
        description: updatedItem[0].description,
        category: updatedItem[0].category,
        url: updatedItem[0].url,
      },
    },
    ipAddress: getIp(c),
  });

  return c.json(updatedItem[0]);
});

// 5. Delete Infografis (DELETE)
route.delete('/:id', authentication, async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ message: 'ID tidak valid' }, 400);

  const deleted = await db
    .delete(infografis)
    .where(eq(infografis.id, id))
    .returning();

  if (deleted.length === 0) return c.json({ message: 'Data tidak ditemukan' }, 404);

  try {
    await deleteUploadedImage(deleted[0].url, uploadDir);
  } catch (error) {
    console.error('Gagal menghapus file infografis:', error);
  }

  const user = c.get('user');

  await createAdminLog({
    userId: user?.id,
    username: user?.username,
    action: 'DELETE_INFOGRAFIS',
    targetEntity: 'infografis',
    targetId: String(deleted[0].id),
    details: {
      category: deleted[0].category,
      description: deleted[0].description,
    },
    ipAddress: getIp(c),
  });

  return c.json({ message: 'Terhapus' });
});

export default route;