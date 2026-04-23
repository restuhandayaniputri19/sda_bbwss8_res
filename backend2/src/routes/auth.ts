import { Hono } from "hono";
import { db } from "../db";
import { PubAuth } from "../db/schema";

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

    // 3. Panggil container wa-webjs (Internal network)
    const waResponse = await fetch("http://localhost:3003/send", { // Sesuaikan port/host container
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phoneNumber,
        msg: `Kode OTP Anda untuk layanan Rekomtek adalah: ${otpCode}. Rahasiakan kode ini.`
      }),
    });

    if (!waResponse.ok) throw new Error("Gagal mengirim pesan via WA");

    return c.json({ success: true, message: "OTP terkirim" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default auth;