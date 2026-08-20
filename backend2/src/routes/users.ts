import { Hono } from 'hono';
import { db } from '../db';
import { users, NewUser } from '../db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { authentication } from '../middleware/authentication';
import { hash } from 'bcrypt-ts';
import { createAdminLog } from '../utils/logger';

const manageUsers = new Hono();

// Helper ekstrak IP Address
const getIp = (c: any) =>
  c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
  c.req.header('x-real-ip') ||
  '127.0.0.1';

// Semua rute manajemen user wajib diautentikasi
manageUsers.use('*', authentication);

// ==========================================
// 1. GET: Ambil Semua User (Pagination)
// ==========================================
manageUsers.get('/', async (c) => {
  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const offset = (page - 1) * limit;

    const userList = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(users);

    return c.json({
      status: true,
      data: userList,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// ==========================================
// 2. POST: Tambah User Baru
// ==========================================
manageUsers.post('/', async (c) => {
  try {
    const { username, email, password } = await c.req.json();

    if (!username || !email || !password) {
      return c.json({ status: false, message: 'Data tidak lengkap' }, 400);
    }

    const hashedPassword = await hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning();

    const admin = c.get('user');

    await createAdminLog({
      userId: admin?.id,
      username: admin?.username,
      action: 'CREATE_USER',
      targetEntity: 'users',
      targetId: String(newUser.id),
      details: { username: newUser.username, email: newUser.email },
      ipAddress: getIp(c),
    });

    const { password: _, ...userClean } = newUser;
    return c.json({ status: true, data: userClean }, 201);
  } catch (error: any) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// ==========================================
// 3. PUT: Set Password Paksa (Force Reset)
// ==========================================
manageUsers.put('/:id/force-password', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ status: false, message: 'ID tidak valid' }, 400);

    const { newPassword } = await c.req.json();

    if (!newPassword || newPassword.length < 6) {
      return c.json(
        { status: false, message: 'Password baru minimal 6 karakter' },
        400
      );
    }

    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!targetUser) {
      return c.json({ status: false, message: 'User tidak ditemukan' }, 404);
    }

    const hashedPassword = await hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));

    const admin = c.get('user');

    // Catat aksi sensitif ini di AdminLog
    await createAdminLog({
      userId: admin?.id,
      username: admin?.username,
      action: 'FORCE_SET_PASSWORD',
      targetEntity: 'users',
      targetId: String(targetUser.id),
      details: {
        targetUsername: targetUser.username,
        note: 'Password diubah paksa oleh Admin',
      },
      ipAddress: getIp(c),
    });

    return c.json({
      status: true,
      message: `Password untuk user '${targetUser.username}' berhasil diperbarui`,
    });
  } catch (error: any) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// ==========================================
// 4. DELETE: Hapus User
// ==========================================
manageUsers.delete('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ status: false, message: 'ID tidak valid' }, 400);

    const admin = c.get('user');

    // Mencegah admin menghapus dirinya sendiri
    if (admin?.id === id) {
      return c.json(
        { status: false, message: 'Tidak dapat menghapus akun sendiri' },
        400
      );
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deletedUser) {
      return c.json({ status: false, message: 'User tidak ditemukan' }, 404);
    }

    await createAdminLog({
      userId: admin?.id,
      username: admin?.username,
      action: 'DELETE_USER',
      targetEntity: 'users',
      targetId: String(deletedUser.id),
      details: { username: deletedUser.username, email: deletedUser.email },
      ipAddress: getIp(c),
    });

    return c.json({ status: true, message: 'User berhasil dihapus' });
  } catch (error: any) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

export default manageUsers;