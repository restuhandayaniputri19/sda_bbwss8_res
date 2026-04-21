import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db';
import { waAuth } from '../db/schema';
import { eq } from 'drizzle-orm';

export const otpRateLimiter = async (c: Context, next: Next) => {
  const body = await c.req.json().catch(() => ({}));
  const no_wa = body.no_wa;

  if (!no_wa) return c.json({ message: 'No WA wajib diisi' }, 400);

  const now = new Date();
  const [existing] = await db.select().from(waAuth).where(eq(waAuth.no_wa, no_wa));

  if (existing) {
    const diff = now.getTime() - existing.last_request.getTime();
    if (diff < 60000) { // Proteksi 1 menit
      throw new HTTPException(429, { message: 'Tunggu 1 menit untuk kirim ulang.' });
    }
  }

  await next();
};