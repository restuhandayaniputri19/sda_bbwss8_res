import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { compare } from 'bcrypt-ts';
import { db } from '../db'; // Instance Drizzle ORM kamu
import { users } from '../db/schema'; // Table schema user SQLite
import { eq } from 'drizzle-orm';

const auth = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// =================================================================
// 1. LOGIN PROVIDER B (Internal Hono / SQLite)
// =================================================================
auth.post('/login/b', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ status: false, message: "Username dan password wajib diisi" }, 400);
    }

    // Cari user di SQLite
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      console.log(`[AUTH-B] User ${username} tidak ditemukan.`);
      return c.json({ status: false, message: "Username atau password salah" }, 401);
    }

    // Pastikan user.password ada sebelum dikomparasi
    if (!user.password || !(await compare(password, user.password))) {
      console.log(`[AUTH-B] Password salah untuk user: ${username}`);
      return c.json({ status: false, message: "Username atau password salah" }, 401);
    }

    // Payload JWT
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      source: 'B',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    };

    const token = await sign(payload, JWT_SECRET, 'HS256');

    return c.json({
      status: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error: any) {
    // CETAK ERROR ASLI DI TERMINAL HONO
    console.error('[AUTH-B CRASH]:', error);
    return c.json({ status: false, message: error.message || "Terjadi kesalahan server" }, 500);
  }
});

// =================================================================
// LOGIN PROVIDER A (External Express / MySQL sda.pu.go.id)
// =================================================================
auth.post('/login/a', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ status: false, message: 'Username dan password wajib diisi' }, 400);
    }

    // Target URL API Express Legacy
    const targetUrl = 'https://sda.pu.go.id/balai/bbwssumatera8/api/auth/login';

    console.log(`[AUTH-A PROXY] Meneruskan login untuk user: ${username} -> ${targetUrl}`);

    // Forward Kredensial ke Express
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const responseText = await response.text();
    console.log(`[AUTH-A RESPONSE STATUS]: ${response.status}`);
    console.log(`[AUTH-A RESPONSE BODY]:`, responseText);

    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch {
      return c.json({ status: false, message: 'Server legacy mengembalikan respons non-JSON' }, 502);
    }

    // Jika Express merespons 401 (Invalid credentials)
    if (!response.ok) {
      return c.json(
        {
          status: false,
          message: data.message || 'Username atau password di server warisan salah',
        },
        response.status as any
      );
    }

    // Express mengirimkan respons berupa { token: "..." }
    const token = data.token;

    if (!token) {
      return c.json({ status: false, message: 'Token tidak ditemukan pada respons Express' }, 502);
    }

    // Berhasil login
    return c.json({
      status: true,
      message: 'Login berhasil (Sistem Warisan)',
      token: token,
      user: {
        username: username,
      },
    });

  } catch (error: any) {
    console.error('[AUTH-A ERROR]:', error.message);
    return c.json({ status: false, message: `Gagal terhubung ke Express: ${error.message}` }, 502);
  }
});

// =================================================================
// 3. ENDPOINT CEK PROFILE USER LOKAL (/auth/me)
// =================================================================
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ status: false, message: 'Unauthorized' }, 401);
  }

  // Token valid
  return c.json({ status: true, message: 'Token aktif' });
});

export default auth;