
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


export const permintaanData = sqliteTable('permintaan_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  namaLengkap: text('nama_lengkap').notNull(),
  
  instansi: text('instansi'),
  
  jenisData: text('jenis_data').notNull(),
  
  // DATEONLY di Sequelize cocok menggunakan text di SQLite (YYYY-MM-DD)
  periodeDari: text('periode_dari').notNull(),
  
  periodeSampai: text('periode_sampai').notNull(),
  
  email: text('email').notNull(),
  
  noWa: text('no_wa').notNull(),
  
  tujuanPenggunaan: text('tujuan_penggunaan').notNull(),
  
  fileSurat: text('file_surat'),
  
  // SQLite tidak memiliki tipe ENUM asli, kita gunakan text dengan pengecekan di level aplikasi
  status: text('status', { enum: ["pending", "diproses", "selesai", "ditolak"] })
    .notNull()
    .default('pending'),

  // JSON di SQLite disimpan sebagai TEXT. 
  // Drizzle akan membantu parsing jika kita definisikan sebagai objek/array.
  statusLogs: text('status_logs', { mode: 'json' })
    .$type<Array<{ status: string; timestamp: string; note?: string }>>()
    .default(sql`'[]'`),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`),
    
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`),
});

// Inferensi tipe untuk digunakan di frontend/backend
export type PermintaanData = typeof permintaanData.$inferSelect;
export type InsertPermintaanData = typeof permintaanData.$inferInsert;