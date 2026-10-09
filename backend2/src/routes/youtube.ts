import { Hono } from 'hono';
import { db } from '../db';
import { youtube } from '../db/schema';
import { eq, desc, asc, count } from 'drizzle-orm';
import { authentication } from '../middleware/authentication';

const app = new Hono();

// ==========================================
// RUTE PUBLIK (GET)
// ==========================================

// 1. Get All YouTube Entries with Pagination and Sorting
app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;

    const sortParam = c.req.query('sort') || 'newest';
    const orderBy = sortParam === 'oldest' ? asc(youtube.createdAt) : desc(youtube.createdAt);

    // Hitung Total Data
    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(youtube);

    // Ambil Data
    const youtubes = await db
      .select()
      .from(youtube)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalItems / limit);

    return c.json({
      data: youtubes,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.error('Error GET /youtube:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE PROTEKSI AUTHENTICATION (POST, PUT, DELETE)
// ==========================================

// 2. Create New YouTube Entry
app.post('/', authentication, async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const url = body.url;

    if (!url) {
      return c.json({ message: 'URL is required' }, 400);
    }

    const [newYoutube] = await db
      .insert(youtube)
      .values({ url })
      .returning();

    return c.json({ data: newYoutube }, 201);
  } catch (error: any) {
    console.error('Error POST /youtube:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 3. Update a YouTube Entry by ID
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json().catch(() => ({}));
    const url = body.url;

    const [existing] = await db.select().from(youtube).where(eq(youtube.id, id));

    if (!existing) {
      return c.json({ message: 'YouTube entry not found' }, 404);
    }

    if (!url) {
      return c.json({ message: 'URL is required' }, 400);
    }

    const [updated] = await db
      .update(youtube)
      .set({
        url,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(youtube.id, id))
      .returning();

    return c.json({ data: updated });
  } catch (error: any) {
    console.error('Error PUT /youtube/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 4. Delete a YouTube Entry by ID
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [existing] = await db.select().from(youtube).where(eq(youtube.id, id));

    if (!existing) {
      return c.json({ message: 'YouTube entry not found' }, 404);
    }

    await db.delete(youtube).where(eq(youtube.id, id));

    return c.json({ message: 'YouTube entry deleted successfully' });
  } catch (error: any) {
    console.error('Error DELETE /youtube/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;