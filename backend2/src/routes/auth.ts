import { Hono } from "hono";
import { db } from "../db";
import { PubAuth } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";

const auth = new Hono();

auth.get("/", (c) => c.text("Auth Endpoint is Active!"));
auth.post("/send-otp", async (c) => {
  const { phoneNumber } = await c.req.json();
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 3 * 60000); // +3 Menit (3 * 60 detik * 1000ms)
  const lastRequest = now; // Waktu sekarang untuk rate limit
  
  // 1. Generate 6 digit OTP sederhana
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

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

    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      console.log(`[DEV MODE] OTP untuk ${phoneNumber}: ${otpCode} (kadaluwarsa pada ${expiresAt.toLocaleString()})`);
      return c.json({ success: true, message: "OTP terkirim (DEV MODE)", otp: otpCode }); // Kirim OTP di response untuk dev
    } else {
      // 3. Panggil container wa-webjs (Internal network)
      const waResponse = await fetch("http://localhost:3003/send", { // Sesuaikan port/host container
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phoneNumber,
          msg: `OTP: ${otpCode}. Kadaluwarsa pada ${expiresAt.toLocaleString()}.`
        }),
      });

      if (!waResponse.ok) throw new Error("Gagal mengirim pesan via WA");
    }

    return c.json({ success: true, message: "OTP terkirim" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

auth.post("/verify-otp", async (c) => {
  const { phoneNumber, otp } = await c.req.json();

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