import { Hono } from 'hono';
import { db } from '../db';
import { kesiapsiagaan_bencana } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authentication } from '../middleware/authentication';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createAdminLog } from '../utils/logger';

const uploadDir = join(process.cwd(), 'uploads', 'kesiapsiagaan-bencana');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const route = new Hono();

// Helper untuk mengambil IP Address
const getIp = (c: any) =>
  c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
  c.req.header('x-real-ip') ||
  '127.0.0.1';

// 1. Ambil Semua Data Kesiapsiagaan Bencana
route.get('/', async (c) => {
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 10;
  const offset = (page - 1) * limit;

  const releaseDateFilter = c.req.query('releaseDate');

  const whereCondition = releaseDateFilter
    ? eq(kesiapsiagaan_bencana.releaseDate, releaseDateFilter as string)
    : undefined;

  const list = await db
    .select()
    .from(kesiapsiagaan_bencana)
    .where(whereCondition)
    .limit(limit)
    .offset(offset)
    .all();

  const allData = await db.select().from(kesiapsiagaan_bencana).where(whereCondition).all();
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
        releaseDate: item.releaseDate,
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

// 2. Ambil Kesiapsiagaan Bencana Berdasarkan ID
route.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ message: 'ID tidak valid' }, 400);

  const [item] = await db
    .select()
    .from(kesiapsiagaan_bencana)
    .where(eq(kesiapsiagaan_bencana.id, id))
    .all();

  if (!item) return c.json({ message: 'Data tidak ditemukan' }, 404);
  return c.json(item);
});

// 3. Create Kesiapsiagaan Bencana (POST)
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
  const host = urlObj.host;

  const currentRoutePath = '/kesiapsiagaan-bencana/upload';
  const basePath = c.req.path.split(currentRoutePath)[0];

  const generatedUrl = `https://${host}${basePath}/uploads/kesiapsiagaan-bencana/${fileName}`;

  const newItem = await db
    .insert(kesiapsiagaan_bencana)
    .values({
      url: generatedUrl,
      description: body.description as string,
      releaseDate: body.releaseDate as string,
    })
    .returning();

  const user = c.get('user');

  await createAdminLog({
    userId: user?.id,
    username: user?.username,
    action: 'CREATE_KESIAPSIAGAAN_BENCANA',
    targetEntity: 'kesiapsiagaan_bencana',
    targetId: String(newItem[0].id),
    details: {
      description: newItem[0].description,
      releaseDate: newItem[0].releaseDate,
    },
    ipAddress: getIp(c),
  });

  return c.json(newItem[0], 201);
});

// 4. Update Kesiapsiagaan Bencana (PUT)
route.put('/:id', authentication, async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ message: 'ID tidak valid' }, 400);

  const [existingItem] = await db
    .select()
    .from(kesiapsiagaan_bencana)
    .where(eq(kesiapsiagaan_bencana.id, id))
    .all();

  if (!existingItem) return c.json({ message: 'Data tidak ditemukan' }, 404);

  const body = await c.req.parseBody();

  const updatedItem = await db
    .update(kesiapsiagaan_bencana)
    .set({
      url: (body.url as string) || existingItem.url,
      description: body.description as string,
      releaseDate: body.releaseDate as string,
    })
    .where(eq(kesiapsiagaan_bencana.id, id))
    .returning();

  if (updatedItem.length === 0) return c.json({ message: 'Gagal update' }, 404);

  const user = c.get('user');

  await createAdminLog({
    userId: user?.id,
    username: user?.username,
    action: 'UPDATE_KESIAPSIAGAAN_BENCANA',
    targetEntity: 'kesiapsiagaan_bencana',
    targetId: String(updatedItem[0].id),
    details: {
      old: {
        description: existingItem.description,
        releaseDate: existingItem.releaseDate,
        url: existingItem.url,
      },
      new: {
        description: updatedItem[0].description,
        releaseDate: updatedItem[0].releaseDate,
        url: updatedItem[0].url,
      },
    },
    ipAddress: getIp(c),
  });

  return c.json(updatedItem[0]);
});

// 5. Delete Kesiapsiagaan Bencana (DELETE)
route.delete('/:id', authentication, async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ message: 'ID tidak valid' }, 400);

  const deleted = await db
    .delete(kesiapsiagaan_bencana)
    .where(eq(kesiapsiagaan_bencana.id, id))
    .returning();

  if (deleted.length === 0) return c.json({ message: 'Data tidak ditemukan' }, 404);

  const user = c.get('user');

  await createAdminLog({
    userId: user?.id,
    username: user?.username,
    action: 'DELETE_KESIAPSIAGAAN_BENCANA',
    targetEntity: 'kesiapsiagaan_bencana',
    targetId: String(deleted[0].id),
    details: {
      description: deleted[0].description,
      releaseDate: deleted[0].releaseDate,
    },
    ipAddress: getIp(c),
  });

  return c.json({ message: 'Terhapus' });
});

export default route;