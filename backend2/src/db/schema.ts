
// Tabel untuk verifikasi OTP dan proteksi Rate Limit


import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { ulid } from 'ulidx'; // Library ringan untuk ULID

export const CATEGORIES = [
  'bendungan',
  'irigasi & rawa',
  'sungai',
  'danau',
  'embung',
  'air tanah & air baku'
] as const;

export type Category = (typeof CATEGORIES)[number];

export const users = sqliteTable("users", {
  // Primary Key
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // username: unique & not null
  username: text("username").notNull().unique(),
  
  // email: unique & not null
  email: text("email").notNull().unique(),
  
  // password: not null
  password: text("password").notNull(),
  
  lastLogin: integer("last_login", { mode: "timestamp" }),
  
  // Sesuai prinsip "Slow and Low", kita catat kapan user ini dibuat
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

// Type definitions untuk mempermudah coding di Hono
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;


export const infografis = sqliteTable("infografis", {
  // Primary Key
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // url: DataTypes.STRING, allowNull: false
  url: text("url").notNull(),
  
  // description: DataTypes.STRING, allowNull: true
  description: text("description"),
  
  // category: allowNull true
  category: text("category").$type<Category>(),
  
  // Timestamp untuk pencatatan alamiah (opsional namun manfaat)
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

// Type definitions untuk kemudahan coding
export type Infografis = typeof infografis.$inferSelect;
export type NewInfografis = typeof infografis.$inferInsert;

export const galleries = sqliteTable("galleries", {
  // Primary Key otomatis (ID)
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // url: allowNull false
  url: text("url").notNull(),
  
  // description: allowNull true
  description: text("description"),
  
  // category: allowNull true
  category: text("category").$type<Category>(),
  
  // Opsional: Tambahkan timestamp jika diperlukan (seringkali bermanfaat)
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

// Export tipe untuk digunakan di aplikasi Hono Bapak
export type Gallery = typeof galleries.$inferSelect;
export type NewGallery = typeof galleries.$inferInsert;

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