import { db } from '../db';
import { adminLogs, NewAdminLog } from '../db/schema';

export async function createAdminLog(
  data: Omit<NewAdminLog, 'id' | 'createdAt'>
) {
  try {
    await db.insert(adminLogs).values(data);
  } catch (error) {
    // Tangkap error log agar tidak menggagalkan proses utama
    console.error('[AdminLog Error]: Gagal mencatat log:', error);
  }
}