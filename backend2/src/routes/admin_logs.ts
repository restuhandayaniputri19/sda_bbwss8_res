import { Hono } from 'hono';
import { eq, desc, count, and } from 'drizzle-orm';
import { db } from '../db'; // Sesuaikan lokasi instance Drizzle DB Anda
import { adminLogs, NewAdminLog } from '../db/schema';

const adminLogsRoute = new Hono();

// ==========================================
// 1. SELECT: Ambil Daftar Log (Pagination & Filter)
// GET /balai/bbwssumatera8/api2/admin-logs
// Query Params: ?page=1&limit=20&action=CREATE&target_entity=berita
// ==========================================
adminLogsRoute.get('/', async (c) => {
  try {
    const page = Number(c.req.query('page') || '1');
    const limit = Number(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;

    const actionFilter = c.req.query('action');
    const entityFilter = c.req.query('target_entity');

    // Kumpulkan kondisi filter
    const conditions = [];
    if (actionFilter) conditions.push(eq(adminLogs.action, actionFilter));
    if (entityFilter) conditions.push(eq(adminLogs.targetEntity, entityFilter));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch data log
    const logs = await db
      .select()
      .from(adminLogs)
      .where(whereClause)
      .orderBy(desc(adminLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Hitung total data untuk pagination
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(adminLogs)
      .where(whereClause);

    return c.json({
      status: true,
      data: logs,
      pagination: {
        page,
        limit,
        total: Number(totalCount),
        totalPages: Math.ceil(Number(totalCount) / limit)
      }
    });
  } catch (error: any) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// ==========================================
// 2. SELECT: Ambil Detail Single Log by ID
// GET /balai/bbwssumatera8/api2/admin-logs/:id
// ==========================================
adminLogsRoute.get('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ status: false, message: 'ID tidak valid' }, 400);
    }

    const [log] = await db
      .select()
      .from(adminLogs)
      .where(eq(adminLogs.id, id))
      .limit(1);

    if (!log) {
      return c.json({ status: false, message: 'Log tidak ditemukan' }, 404);
    }

    return c.json({ status: true, data: log });
  } catch (error: any) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// ==========================================
// 3. INSERT: Manual Insert via API Endpoint
// POST /balai/bbwssumatera8/api2/admin-logs
// ==========================================
adminLogsRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, username, action, targetEntity, targetId, details } = body;

    if (!action) {
      return c.json({ status: false, message: "Field 'action' wajib diisi" }, 400);
    }

    // Ambil IP Address dari header
    const ipAddress =
      c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
      c.req.header('x-real-ip') ||
      '127.0.0.1';

    const [inserted] = await db
      .insert(adminLogs)
      .values({
        userId,
        username,
        action,
        targetEntity,
        targetId,
        details: details || {},
        ipAddress
      })
      .returning();

    return c.json({
      status: true,
      message: 'Log berhasil dicatat',
      data: inserted
    }, 201);
  } catch (error: any) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

export default adminLogsRoute;