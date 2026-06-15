import { Hono } from 'hono';
import { db } from '../db'; // Asumsi instansi drizzle db Bapak
import { galleries, Category } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authentication } from '../middleware/authentication';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const uploadDir = join(process.cwd(), 'uploads', 'galeri');
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}

const galeri = new Hono();

// 1. Ambil Semua Data Galeri
galeri.get('/', async (c) => {
    // 1. Ambil Parameter (untuk Meta)
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const offset = (page - 1) * limit;

    const categoryFilter = c.req.query('category');

    // 2. Susun Kondisi Query secara fleksibel
    // Jika parameter 'category' dikirim oleh frontend, buat kondisi pencocokannya
    const whereCondition = categoryFilter 
        ? eq(galleries.category, categoryFilter as Category) 
        : undefined;
    
    // 2. Eksekusi Query (Ambil data dan Total untuk pagination)
    const galleryList = await db.select().from(galleries).where(whereCondition).limit(limit).offset(offset).all();

    // Untuk Meta, kita butuh jumlah total item
    // Catatan: Jika ingin sederhana, bisa gunakan .all().length, 
    // namun untuk efisiensi di database besar biasanya menggunakan count()
    const allData = await db.select().from(galleries).where(whereCondition).all();
    const count = allData.length;
    const totalPages = Math.ceil(count / limit);

    // 3. Persiapkan Informasi Protokol (untuk URL Replace)
    const urlObj = new URL(c.req.url);
    const protocol = urlObj.protocol.replace(':', ''); // 'http' atau 'https'

    console.log('--- Data Galeri yang Ditemukan ---');
    console.log(`Menampilkan halaman ${page} dari ${totalPages}`);

    // 4. Return sesuai format yang diminta
    return c.json({
        data: galleryList.map((gallery) => ({
            id: gallery.id,
            // Mengganti protokol secara dinamis
            url: gallery.url.replace(/^https?:\/\//, `${protocol}://`),
            description: gallery.description,
            category: gallery.category,
            createdAt: gallery.createdAt,
            // Jika di schema tidak ada updatedAt, baris ini bisa dihapus atau disesuaikan
            updatedAt: gallery.createdAt,
        })),
        meta: {
            totalItems: count,
            totalPages: totalPages,
            currentPage: page,
            itemsPerPage: limit,
        },
    }, 200);
});

// 2. Ambil Galeri Berdasarkan ID
galeri.get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const [item] = await db.select().from(galleries).where(eq(galleries.id, id)).all();

    if (!item) return c.json({ message: 'Data tidak ditemukan' }, 404);
    return c.json(item);
});

// 3. Create Gallery (POST)
galeri.post('/upload', authentication, async (c) => {
    // Catatan: uploadMiddleware logika fisik file bisa ditaruh di sini 
    // atau menggunakan c.req.parseBody() untuk multipart
    const body = await c.req.parseBody();

    const file = body.gallery as File;

    if (!file || !(file instanceof File)) {
        return c.json({ message: "File tidak ditemukan" }, 400);
    }

    const d = new Date();
    const tahun = d.getFullYear(); // 2026
    const bulan = String(d.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0, maka ditambah 1
    const tanggal = String(d.getDate()).padStart(2, '0');

    // 2. Gabungkan menjadi format YYYYMMDD (misal: 20260613)
    const dateFormatted = `${tahun}${bulan}${tanggal}`;

    // 1. Buat Nama File Unik (Slow and Low: sederhana tapi unik)
    const fileName = `${dateFormatted}-${file.name.replaceAll(' ', '-')}`;
    const filePath = join(uploadDir, fileName);

    // 2. Simpan File ke Disk
    const arrayBuffer = await file.arrayBuffer();
    writeFileSync(filePath, Buffer.from(arrayBuffer));

    // 1. Ambil informasi Host dan Protokol
    const urlObj = new URL(c.req.url);
    const protocol = urlObj.protocol; // http: atau https:
    const host = urlObj.host;         // localhost:3000 atau domain.com

    const currentRoutePath = '/galeri/upload';
    const basePath = c.req.path.split(currentRoutePath)[0]; // Hasil: '/balai/bbwssumatera8/api2'

    // Susun URL penuh dengan menyisipkan basePath sebelum '/uploads'
    const generatedUrl = `${protocol}//${host}${basePath}/uploads/galeri/${fileName}`;

    const newItem = await db.insert(galleries).values({
        url: generatedUrl,
        description: body.description as string,
        category: body.category as Category, // Menggunakan kategori yang kita buat tadi
    }).returning();

    return c.json(newItem[0], 201);
});

// 4. Update Gallery (PUT)
galeri.put('/:id', authentication, async (c) => {
    const id = Number(c.req.param('id'));
    const body = await c.req.parseBody();

    const updatedItem = await db.update(galleries)
        .set({
            url: body.url as string,
            description: body.description as string,
            category: body.category as Category,
        })
        .where(eq(galleries.id, id))
        .returning();

    if (updatedItem.length === 0) return c.json({ message: 'Gagal update' }, 404);
    return c.json(updatedItem[0]);
});

// 5. Delete Gallery
galeri.delete('/:id', authentication, async (c) => {
    const id = Number(c.req.param('id'));

    const deleted = await db.delete(galleries)
        .where(eq(galleries.id, id))
        .returning();

    if (deleted.length === 0) return c.json({ message: 'Data tidak ditemukan' }, 404);
    return c.json({ message: 'Terhapus' });
});

export default galeri;