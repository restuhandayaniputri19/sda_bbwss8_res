import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tabel untuk verifikasi OTP dan proteksi Rate Limit
export const waAuth = sqliteTable('wa_auth', {
  no_wa: text('no_wa').primaryKey(),
  otp_code: text('otp_code').notNull(),
  expires_at: integer('expires_at', { mode: 'timestamp' }).notNull(), // Lifetime 3 menit
  last_request: integer('last_request', { mode: 'timestamp' }).notNull(), // Untuk Rate Limit 1 menit
});

