import { Hono } from 'hono';
import { db } from '../db';
import { infografis, Category } from '../db/schema';
import { and, eq, gte, lt } from 'drizzle-orm';
import { authentication } from '../middleware/authentication';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const uploadDir = join(process.cwd(), 'uploads', 'infografis');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const route = new Hono();

// 1. Ambil Semua Data Infografis (dengan Pagination & Filter Kategori)
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

  const d = new Date();
  const tahun = d.getFullYear();
  const bulan = String(d.getMonth() + 1).padStart(2, '0');
  const tanggal = String(d.getDate()).padStart(2, '0');
  const dateFormatted = `${tahun}${bulan}${tanggal}`;

  const fileName = `${dateFormatted}-${file.name.replaceAll(' ', '-')}`;
  const filePath = join(uploadDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  writeFileSync(filePath, Buffer.from(arrayBuffer));

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

  return c.json(newItem[0], 201);
});

// 4. Update Infografis (PUT)
route.put('/:id', authentication, async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ message: 'ID tidak valid' }, 400);

  const body = await c.req.parseBody();

  const updatedItem = await db
    .update(infografis)
    .set({
      url: body.url as string,
      description: body.description as string,
      category: body.category as Category,
    })
    .where(eq(infografis.id, id))
    .returning();

  if (updatedItem.length === 0) return c.json({ message: 'Gagal update' }, 404);
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
  return c.json({ message: 'Terhapus' });
});

export default route;
