import { Hono } from "hono";
import { db } from "../db";
import { PubAuth, users } from "../db/schema";
import { eq, and, gt, or } from "drizzle-orm";
import { sign } from 'hono/jwt';
import { hash, compare } from "bcrypt-ts";

const auth = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

auth.get("/", (c) => c.text("Auth Endpoint is Active!"));

// --- 1. REGISTER ---
auth.post('/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();

    // Cek apakah user/email sudah ada
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ message: "Username atau email sudah terdaftar" }, 400);
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Simpan ke PostgreSQL
    const [newUser] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
    }).returning();

    return c.json({ message: "User berhasil dibuat", user: { id: newUser.id, username: newUser.username } }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// --- 2. LOGIN ---
auth.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    // Cari user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    // Validasi user & password
    if (!user || !(await compare(password, user.password))) {
      return c.json({ message: "Kredensial tidak valid" }, 401);
    }

    // Update lastLogin
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Buat JWT Token (Expire 12 jam sesuai request Bapak)
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12, // 12 jam
    };

    const token = await sign(payload, JWT_SECRET, 'HS256');

    return c.json({ token });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

auth.post("/send-otp", async (c) => {
  console.log("Endpoint /auth/send-otp diakses");
  const { phoneNumber } = await c.req.json();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 3 * 60000); // +3 Menit (3 * 60 detik * 1000ms)
  const lastRequest = now; // Waktu sekarang untuk rate limit

  // 1. Generate 4 digit OTP sederhana
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString().slice(0, 4);

  try {
    // 2. Simpan ke SQLite
    await db.insert(PubAuth).values({
      identifier: phoneNumber,
      type: 'whatsapp',
      otp_code: otpCode,
      expires_at: expiresAt,
      last_request: lastRequest,
    })
      .onConflictDoUpdate({
        // Jika terjadi tabrakan pada index unik (identifier + type)
        target: [PubAuth.identifier, PubAuth.type],
        set: {
          // Update dengan data OTP yang baru
          otp_code: otpCode,
          expires_at: expiresAt,
          last_request: now,
          // Kita biarkan ul_id tetap yang lama (opsional) 
          // atau update jika ingin ganti karakter "sulit" nya
        },
      })
      .returning({ id_pamer: PubAuth.ul_id }); // Mengembalikan ULID untuk referensi eksternal (opsional)

    const urlObj = new URL(c.req.url);
    const host = urlObj.hostname; // localhost:3000 atau domain.com

    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log(`[DEV MODE] OTP untuk ${phoneNumber}: ${otpCode} (kadaluwarsa pada ${expiresAt.toLocaleString()})`);
      return c.json({ success: true, message: "OTP terkirim (DEV MODE)", otp: otpCode }); // Kirim OTP di response untuk dev
    } else {
      console.log(`OTP untuk ${phoneNumber} disimpan di database. Mengirim pesan via WA...`);
      // 3. Panggil container wa-webjs (Internal network)
      const waResponse = await fetch(`${process.env.WA_GATEWAY_URL}/send`, { // Sesuaikan port/host container
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.WA_TOKEN}`
        },
        body: JSON.stringify({
          to: phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber,
          msg: `[BBWS Sumatera VIII] OTP: *${otpCode}*, akan kadaluwarsa pada ${expiresAt.toLocaleString()}.`
        }),
      });
      // Kirim ke group WA khusus admin untuk monitoring (opsional)
      const responseText = await waResponse.text();
      console.log('Respon Server WA:', responseText);

      if (!waResponse.ok) {
        // Ambil detail pesan eror dari response gateway jika ada
        const errorText = await waResponse.text();

        // 1. Cetak ke console.error agar masuk ke `docker logs`
        console.error(`[WA_ERROR] Gagal mengirim pesan via WA. Status: ${waResponse.status}, Detail: ${errorText}`);

        // 2. Lempar eror untuk ditangkap oleh blok catch utama
        throw new Error(`Gagal mengirim pesan via WA: ${errorText}`);
      }

      await delay(3000);

      const waResponse2 = await fetch(`${process.env.WA_GATEWAY_URL}/send`, { // Sesuaikan port/host container
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WA_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: "120363427359958027@g.us",
          msg: `[BBWS Sumatera VIII] Permintaan OTP dari ${phoneNumber}, akan kadaluwarsa pada ${expiresAt.toLocaleString()}.`
        }),
      });

      const responseText2 = await waResponse2.text();
      console.log('Respon Server WA:', responseText2);

      if (!waResponse2.ok) {
        // Ambil detail pesan eror dari response gateway jika ada
        const errorText = await waResponse.text();

        // 1. Cetak ke console.error agar masuk ke `docker logs`
        console.error(`[WA_ERROR] Gagal mengirim pesan via WA. Status: ${waResponse.status}, Detail: ${errorText}`);

        // 2. Lempar eror untuk ditangkap oleh blok catch utama
        throw new Error(`Gagal mengirim pesan via WA: ${errorText}`);
      }

    }

    return c.json({ success: true, message: "OTP terkirim" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
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