import { Hono } from 'hono';
import { db } from '../db';
import { geolocation } from '../db/schema';
import { eq, like, desc, asc, count } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';

const app = new Hono();

// Helper Protocol (HTTP / HTTPS)
const getProtocol = (c: any) =>
  process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Helper Upload File
const saveUploadedFile = async (file: File, folderName: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads', folderName);
  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const fileExt = path.extname(file.name) || '.png';
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

// 1. Read All Geolocations (Pagination, Search, & Sorting)
app.get('/', async (c) => {
    console.log('--- GET /geolocation ---');
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;

    const searchQuery = (c.req.query('search') || '').toLowerCase();
    const sortParam = c.req.query('sort') || 'newest';
    const orderBy = sortParam === 'oldest' ? asc(geolocation.createdAt) : desc(geolocation.createdAt);

    const whereClause = searchQuery ? like(geolocation.title, `%${searchQuery}%`) : undefined;

    // Total Count
    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(geolocation)
      .where(whereClause);

    // Fetch Rows
    const geolocationList = await db
      .select()
      .from(geolocation)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const protocol = getProtocol(c);
    const totalPages = Math.ceil(totalItems / limit);

    const formattedData = geolocationList.map((geo) => ({
      id: geo.id,
      title: geo.title,
      location: geo.location,
      url: geo.url.replace(/^https?:\/\//, `${protocol}://`),
      createdAt: geo.createdAt,
      updatedAt: geo.updatedAt,
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

// 2. Read Geolocation By ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [geo] = await db.select().from(geolocation).where(eq(geolocation.id, id));

    if (!geo) {
      return c.json({ message: 'Geolocation not found' }, 404);
    }

    const protocol = getProtocol(c);
    const formattedData = {
      id: geo.id,
      title: geo.title,
      location: geo.location,
      url: geo.url.replace(/^https?:\/\//, `${protocol}://`),
      createdAt: geo.createdAt,
      updatedAt: geo.updatedAt,
    };

    return c.json({ data: formattedData });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE PROTEKSI AUTHENTICATION (POST, PUT, DELETE)
// ==========================================

// 3. Create Geolocation
app.post('/', authentication, async (c) => {
  try {
    const formData = await c.req.parseBody();
    const title = formData['title'] as string;
    const location = formData['location'] as string;
    const file = formData['file'] as File;

    if (!file || typeof file === 'string') {
      return c.json({ message: 'File is required' }, 400);
    }

    const filename = await saveUploadedFile(file, 'geolocation');
    const host = c.req.header('host') || 'localhost:3000';
    const protocol = getProtocol(c);
    const fileUrl = `${protocol}://${host}/uploads/geolocation/${filename}`;

    const [inserted] = await db
      .insert(geolocation)
      .values({
        title,
        location,
        url: fileUrl,
      })
      .returning();

    return c.json({
      data: {
        id: inserted.id,
        title: inserted.title,
        location: inserted.location,
        url: inserted.url,
        createdAt: inserted.createdAt,
        updatedAt: inserted.updatedAt,
      },
    }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 4. Update Geolocation
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(geolocation).where(eq(geolocation.id, id));

    if (!existing) {
      return c.json({ message: 'Geolocation not found' }, 404);
    }

    const formData = await c.req.parseBody();
    const title = (formData['title'] as string) || existing.title;
    const location = (formData['location'] as string) || existing.location;
    const file = formData['file'] as File;

    let newUrl = existing.url;

    if (file && typeof file !== 'string') {
      const oldFileName = path.basename(existing.url);
      await deleteFile('geolocation', oldFileName);

      const filename = await saveUploadedFile(file, 'geolocation');
      const host = c.req.header('host') || 'localhost:3000';
      const protocol = getProtocol(c);
      newUrl = `${protocol}://${host}/uploads/geolocation/${filename}`;
    }

    const [updated] = await db
      .update(geolocation)
      .set({
        title,
        location,
        url: newUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(geolocation.id, id))
      .returning();

    return c.json({
      data: {
        id: updated.id,
        title: updated.title,
        location: updated.location,
        url: updated.url,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 5. Delete Geolocation
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(geolocation).where(eq(geolocation.id, id));

    if (!existing) {
      return c.json({ message: 'Geolocation not found' }, 404);
    }

    const fileName = path.basename(existing.url);
    await deleteFile('geolocation', fileName);

    await db.delete(geolocation).where(eq(geolocation.id, id));

    return c.json({ message: 'Geolocation deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;