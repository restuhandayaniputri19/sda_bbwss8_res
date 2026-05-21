import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcryptjs'; // Menggunakan bcryptjs agar kompatibel

async function seed() {
  console.log('--- Memulai Seeding User ---');

  // Gunakan password 'demo' atau 'password123' sesuai kebutuhan Bapak
  const passwordInput = "demo"; 
  const hashedPassword = await bcrypt.hash(passwordInput, 10);

  try {
    await db.insert(users).values({
      username: 'admin',
      email: 'admin@contoh.com',
      password: hashedPassword,
      // Di Postgres, kita bisa langsung masukkan objek Date
      lastLogin: new Date(),
      createdAt: new Date(),
    }).onConflictDoNothing(); // Mencegah error jika user 'admin' sudah ada

    console.log(`Berhasil: User 'admin' dengan password '${passwordInput}' siap.`);
  } catch (error) {
    console.error('Terjadi kesalahan saat seeding:', error);
  } finally {
    // Karena kita menggunakan postgres-js, kita perlu menutup koneksi jika script selesai
    process.exit(0);
  }
}

seed();