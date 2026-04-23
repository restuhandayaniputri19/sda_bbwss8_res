
// Tabel untuk verifikasi OTP dan proteksi Rate Limit


import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { ulid } from 'ulidx'; // Library ringan untuk ULID

export const PubAuth = sqliteTable('public_auth', {
  // ID Internal: Tetap pakai integer auto-increment biar kita mudah di CLI
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // ID Eksternal: ULID yang "sulit" dan profesional
  ul_id: text('ul_id').notNull().unique().$defaultFn(() => ulid()),
  
  identifier: text('identifier').notNull(), // no_wa atau email
  type: text('type').notNull().default('whatsapp'), // 'whatsapp' atau 'email'
  
  otp_code: text('otp_code').notNull(),
  expires_at: integer('expires_at', { mode: 'timestamp' }).notNull(),
  last_request: integer('last_request', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  // Indeks unik untuk identitas agar tidak duplikat
  unq_idx: uniqueIndex('unq_idx').on(table.identifier, table.type),
  // Indeks untuk ULID agar fetch via URL tetap kencang
  external_idx: uniqueIndex('external_idx').on(table.ul_id),
}));