// src/services/scheduler.ts
import cron from 'node-cron';
import { fetchPrakiraanBmkg } from '../routes/prakiraan';

/**
 * Memulai penjadwalan tugas periodik untuk scraping prakiraan cuaca BMKG.
 * Jadwal: 3 kali sehari
 * 1. Pagi  : Jam 06:00
 * 2. Siang : Jam 12:00
 * 3. Sore  : Jam 17:00
 */
export const initPrakiraanScheduler = () => {
  // Format Cron: "Menit Jam HariBulan Bulan HariMinggu"
  // '0 6,12,17 * * *' artinya: Pada menit ke-0 di jam 6, jam 12, dan jam 17 setiap hari.
  cron.schedule('0 6,12,17 * * *', async () => {
    console.log('[CRON SCHEDULER] Menjalankan pembaruan otomatis prakiraan cuaca BMKG...');
    try {
      await fetchPrakiraanBmkg();
      console.log('[CRON SCHEDULER] Berhasil memperbarui data prakiraan cuaca BMKG.');
    } catch (error) {
      console.error('[CRON SCHEDULER ERROR] Gagal memperbarui data prakiraan cuaca:', error);
    }
  });

  console.log('[CRON SCHEDULER] Jadwal otomatis BMKG telah diaktifkan (Pagi: 06:00, Siang: 12:00, Sore: 17:00).');
};