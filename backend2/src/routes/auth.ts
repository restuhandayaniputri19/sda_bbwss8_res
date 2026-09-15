import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { compare } from 'bcrypt-ts';
import { db } from '../db';
import { PubAuth, users } from "../db/schema";
import { eq, and, gt, or } from "drizzle-orm";

const auth = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

const opsiWaktu: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Jakarta',
  dateStyle: 'medium',
  timeStyle: 'short'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// =================================================================
// 1. LOGIN PROVIDER B (Internal Hono / SQLite)
// =================================================================
auth.post('/login/b', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ status: false, message: "Username dan password wajib diisi" }, 400);
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      console.log(`[AUTH-B] User ${username} tidak ditemukan.`);
      return c.json({ status: false, message: "Username atau password salah" }, 401);
    }

    if (!user.password || !(await compare(password, user.password))) {
      console.log(`[AUTH-B] Password salah untuk user: ${username}`);
      return c.json({ status: false, message: "Username atau password salah" }, 401);
    }

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
    console.error('[AUTH-B CRASH]:', error);
    return c.json({ status: false, message: error.message || "Terjadi kesalahan server" }, 500);
  }
});

// =================================================================
// 2. LOGIN PROVIDER A (External Express / MySQL sda.pu.go.id)
// =================================================================
auth.post('/login/a', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ status: false, message: 'Username dan password wajib diisi' }, 400);
    }

    const targetUrl = 'https://sda.pu.go.id/balai/bbwssumatera8/api/auth/login';
    console.log(`[AUTH-A PROXY] Meneruskan login untuk user: ${username} -> ${targetUrl}`);

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

    if (!response.ok) {
      return c.json(
        {
          status: false,
          message: data.message || 'Username atau password di server warisan salah',
        },
        response.status as any
      );
    }

    const token = data.token;
    if (!token) {
      return c.json({ status: false, message: 'Token tidak ditemukan pada respons Express' }, 502);
    }

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

  return c.json({ status: true, message: 'Token aktif' });
});

// =================================================================
// 4. ENDPOINT SEND OTP (WHATSAPP)
// =================================================================
auth.post("/send-otp", async (c) => {
  console.log("Endpoint /auth/send-otp diakses");
  
  try {
    const { phoneNumber } = await c.req.json();

    if (!phoneNumber) {
      return c.json({ success: false, message: "Nomor WhatsApp wajib diisi" }, 400);
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 3 * 60000); // +3 Menit
    const lastRequest = now;

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString().slice(0, 4);

    await db.insert(PubAuth).values({
      identifier: phoneNumber,
      type: 'whatsapp',
      otp_code: otpCode,
      expires_at: expiresAt,
      last_request: lastRequest,
    })
      .onConflictDoUpdate({
        target: [PubAuth.identifier, PubAuth.type],
        set: {
          otp_code: otpCode,
          expires_at: expiresAt,
          last_request: now,
        },
      });

    const isDev = process.env.NODE_ENV !== "production";
    
    if (isDev) {
      console.log(`[DEV MODE] OTP untuk ${phoneNumber}: ${otpCode} (kadaluwarsa pada ${expiresAt.toLocaleString('id-ID', opsiWaktu)}) WIB`);
      return c.json({ success: true, message: "OTP terkirim (DEV MODE)", otp: otpCode });
    } else {
      console.log(`OTP untuk ${phoneNumber} disimpan di database. Mengirim pesan via WA...`);
      
      // Send WA 1 (Pengguna)
      const waResponse = await fetch(`${process.env.WA_GATEWAY_URL}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.WA_TOKEN}`
        },
        body: JSON.stringify({
          to: phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber,
          msg: `[BBWS Sumatera VIII] OTP: *${otpCode}*, akan kadaluwarsa pada ${expiresAt.toLocaleString('id-ID', opsiWaktu)} WIB.`
        }),
      });

      const responseText = await waResponse.text();
      console.log('Respon Server WA (User):', responseText);

      if (!waResponse.ok) {
        console.error(`[WA_ERROR] Gagal mengirim pesan ke user. Status: ${waResponse.status}, Detail: ${responseText}`);
        throw new Error(`Gagal mengirim pesan via WA: ${responseText}`);
      }

      await delay(3000);

      // Send WA 2 (Group Admin Monitoring)
      const waResponse2 = await fetch(`${process.env.WA_GATEWAY_URL}/send`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WA_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: "120363427359958027@g.us",
          msg: `[BBWS Sumatera VIII] Permintaan OTP dari ${phoneNumber}, akan kadaluwarsa pada ${expiresAt.toLocaleString('id-ID', opsiWaktu)} WIB.`
        }),
      });

      const responseText2 = await waResponse2.text();
      console.log('Respon Server WA (Admin Group):', responseText2);

      if (!waResponse2.ok) {
        console.error(`[WA_ERROR] Gagal mengirim pesan ke grup admin. Status: ${waResponse2.status}, Detail: ${responseText2}`);
        throw new Error(`Gagal mengirim pesan monitoring via WA: ${responseText2}`);
      }

      return c.json({ success: true, message: "OTP berhasil dikirim via WhatsApp" });
    }
  } catch (error: any) {
    console.error('[SEND-OTP ERROR]:', error);
    return c.json({ success: false, message: error.message || "Gagal memproses permintaan OTP" }, 500);
  }
});

auth.post("/verify-otp", async (c) => {
  const { phoneNumber, otp } = await c.req.json();
  console.log("Endpoint /auth/verify-otp diakses");

  try {
    // Cari OTP yang valid untuk nomor tersebut
    const record = await db.select().from(PubAuth)
      .where(
        and(
          eq(PubAuth.identifier, phoneNumber),
          eq(PubAuth.type, 'whatsapp'),
          eq(PubAuth.otp_code, otp),
          gt(PubAuth.expires_at, new Date()) // Pastikan OTP belum expired
        )
      )
      .get();

    if (record) {
      // OTP valid, bisa lanjutkan dengan logika autentikasi atau pembuatan session
      return c.json({ success: true, message: "OTP valid" });
    } else {
      return c.json({ success: false, message: "OTP tidak valid atau sudah kadaluwarsa" }, 400);
    }
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default auth;